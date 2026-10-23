# Testing

Olivia uses **Jest** with **React Native Testing Library** for unit and
integration tests, and **Detox** for end-to-end flows. This document describes
what exists, how to run it, and what is currently broken.

## Layout

```text
tests/
├── setup.ts                 # global Jest setup
├── mocks/                   # shared mocks (domain entities, ports, utils)
├── unit-test/               # unit tests, mirroring src/
│   ├── domain/
│   ├── database/
│   ├── hooks/
│   └── ui/
├── unit/                    # legacy location, still collected by Jest
├── integration/             # database integration tests
└── e2e/                     # Detox flows (separate Jest config)
```

Jest collects `tests/unit-test/**/*.test|spec.{ts,tsx}` and
`tests/integration/**/*.spec.{ts,tsx}`. Tests inside `src/` are not collected.

## Commands

```bash
pnpm test              # run unit and integration tests
pnpm test:watch        # watch mode
pnpm test:coverage     # coverage report (HTML + LCOV under coverage/)
pnpm test:ci           # CI mode: --ci --coverage --maxWorkers=2
```

Read-only lint/format check, as CI runs it:

```bash
pnpm exec biome ci .
```

End-to-end (requires a simulator and a native debug build):

```bash
pnpm e2e:build:ios:debug
pnpm e2e:test:ios:debug
pnpm e2e:build:android:debug
pnpm e2e:test:android:debug
```

Detox is configured in `.detoxrc.js`; its Jest config lives in
`tests/e2e/jest.config.js`. The iOS configuration expects the generated
`ios/TFG.xcworkspace`; the native folders are git-ignored and must be generated
locally (for example with `npx expo prebuild`).

## Current status (22 October 2026)

These are measured results, not targets. Do not describe the suite as passing
until they change.

| Check | Result |
| --- | --- |
| Biome (`biome ci`) | Passes, 4 warnings |
| `pnpm install --frozen-lockfile` | Passes with the hoisted layout |
| `pnpm test` | 76 of 79 suites pass; 337 of 346 tests pass |
| `pnpm typecheck` | Fails with 146 errors, all in tests (0 in source) |
| `npx expo-doctor` | 18/18 checks pass |
| iOS build / launch | Passes (Release, iPhone 17 simulator, iOS 26.5) |
| Android build / launch | Passes (debug, `Medium_Phone` emulator, Android 17 / API 37) |
| Detox E2E | Not executed in this environment |

### Install layout

`pnpm-workspace.yaml` sets `nodeLinker: hoisted` and keeps the dependency
`overrides`, which pnpm 12 no longer reads from `.npmrc` or `package.json#pnpm`.
Jest's `transformIgnorePatterns` assumes hoisted paths, so install with:

```bash
pnpm install --frozen-lockfile
```

The CI workflow passes `--node-linker=hoisted` explicitly; the committed lockfile
installs with pnpm 12.14.0 and with the pnpm 10.16.1 version pinned in CI.

### Remaining failures

**Suite failures (3).**

- **1 suite: missing module.**
  `secondary-carer.generate-invitation-qr.use-case.spec.ts` imports
  `@/domain/core/enum/time-to-live.enum`, which does not exist.
- **2 suites: 9 failing tests.** `sync-carer.use-case.spec.ts` and
  `secondary-carer.consume-invitation-qr.use-case.spec.ts` expect old response
  messages and mock methods (`getByName`) that the use-cases no longer use.

**Typecheck failures (146).** All are test mocks that no longer match domain
entities. `tsconfig.json` includes `tests/**`, so `pnpm typecheck:src` reports
them too and cannot currently serve as a source-only check.

**E2E.** The parent-setup Detox flow taps `module-cic`, which does not exist in
the current module step, so it would fail even with a working native build.

## Native builds

Native folders are git-ignored and generated locally:

```bash
npx expo prebuild --platform all
```

The native toolchain is coupled through a small set of packages that must move
together:

- **MMKV / Nitro SDK.** `react-native-mmkv` 4.3.2 depends on
  `react-native-nitro-modules` and declares it as a peer with `*`. The committed
  lockfile resolves MMKV with `react-native-nitro-modules@0.35.10`.
- **Reanimated / Worklets.** `react-native-reanimated` 4.1.7 declares
  `react-native-worklets` as a peer in the `0.5 - 0.8` range; the committed
  lockfile resolves `react-native-worklets@0.5.1`.

If either side of those pairs is changed in `package.json`, the lockfile and the
native build must be re-verified together. Do not change MMKV, Nitro SDK,
Reanimated or Worklets in isolation and assume the rest still holds.

With Xcode 27, pods that declare deployment targets below 15.0 (SDWebImage 9.0,
ReachabilitySwift 12.0, RNSVG filters 12.4) fail the simulator build. The verified
build used:

```bash
LANG=en_US.UTF-8 LC_ALL=en_US.UTF-8 pod install   # in ios/

xcodebuild -workspace ios/TFG.xcworkspace -scheme TFG \
  -configuration Release -sdk iphonesimulator \
  -destination "platform=iOS Simulator,id=<UDID>" \
  -derivedDataPath /tmp/olivia-ios-dd \
  IPHONEOS_DEPLOYMENT_TARGET=15.1 CODE_SIGNING_ALLOWED=NO build

xcrun simctl boot <UDID>
xcrun simctl install <UDID> /tmp/olivia-ios-dd/Build/Products/Release-iphonesimulator/TFG.app
xcrun simctl launch <UDID> com.gabriel-alcantara.TFG
```

`npx expo run:ios` requires `Simulator.app`, which may be absent on Xcode 27
installs; the commands above work without it.

For Android, set `JAVA_HOME` to Android Studio's JBR and `ANDROID_HOME` to the SDK:

```bash
JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home" \
ANDROID_HOME="$HOME/Library/Android/sdk" \
npx expo run:android --device Medium_Phone --port 8082
```

Both builds were verified on 22 October 2026 against the current dependency set;
the iOS app rendered its welcome screen and Android reached the onboarding role
selection.

Coverage thresholds in `jest.config.js` are all `0`. Older documentation claimed
70%; that threshold was never enforced. Raise it only after the suite is green
and coverage is measured again.

## Writing tests

- Put domain tests under `tests/unit-test/domain/**`, mirroring `src/domain/**`.
- Prefer testing use-cases and schemas without Expo or React Native imports; use
  the mocks in `tests/mocks/**`.
- Use `satisfies` for mock typing instead of `as` casts.
- Cover the happy path, Zod validation failures and port failures.
- Keep test names behavioural (`it('rejects an expired invitation')`), not
  implementation-specific.
- For UI tests, assert on `testID`s and accessible roles, and use the helpers in
  `tests/unit-test/ui/test-utils.tsx`.

## CI

`.github/workflows/ci.yml` runs on pushes to `main` and on pull requests:

- **Lint and format** is a required gate (`biome ci`).
- **Types and tests** runs `pnpm typecheck` and `pnpm test:ci` in
  non-blocking/advisory mode while the debt above is being fixed. A red advisory
  job is expected and is not a reason to skip the check locally.

When the typecheck and unit suites are green, remove
`continue-on-error` from that job and require it in branch protection.

## References

- [Jest](https://jestjs.io/)
- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)
- [Detox](https://wix.github.io/Detox/)
