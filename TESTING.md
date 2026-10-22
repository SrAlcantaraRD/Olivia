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
| `pnpm test` (repo config) | Fails to start: 0 of 79 suites run |
| Jest with `.pnpm`-aware transform | 55 of 79 suites pass; 291 of 300 tests pass |
| `pnpm typecheck` | Fails with 228 errors (17 in source, 211 in tests) |
| Coverage (when suites run) | 18.5% statements, 6.8% branches, 13.4% functions, 18.8% lines |
| Detox E2E | Not executed in this environment |
| Native app build / launch | Not attempted in this audit |

### Why `pnpm test` fails to start

The installed `node_modules` is pnpm-isolated, so modules resolve through
`node_modules/.pnpm/...`. The Jest `transformIgnorePatterns` regex in
[jest.config.js](jest.config.js) assumes hoisted paths and therefore ignores
React Native's ESM `jest/setup.js`:

```text
SyntaxError: Cannot use import statement outside a module
```

`.npmrc` requests `node-linker=hoisted`, but pnpm 12 ignores that setting
(`pnpm config get node-linker` prints `undefined`). Until the setting moves to
`pnpm-workspace.yaml` (`nodeLinker: hoisted`) or the regex is made `.pnpm`-aware,
reinstall with:

```bash
pnpm install --node-linker=hoisted
```

The CI workflow uses the same flag.

### Remaining failures after the install fix

**Suite failures.** The 24 failing suites break down as follows:

- **17 suites: `react-test-renderer` mismatch.** The dev dependency is `^19.3.1`
  while React is `19.1.0`; React Native Testing Library refuses to run.
- **4 suites: Zod `.omit()` on refined schemas.** `omitAuditColumns()` in
  `src/domain/core/entity/base-dto.entity.ts` calls `.omit()` on a schema that
  contains refinements, which Zod 4.6 rejects. This also loads through summary
  entities, so it is a source-level incompatibility, not just a test problem.
- **1 suite: missing module.**
  `secondary-carer.generate-invitation-qr.use-case.spec.ts` imports
  `@/domain/core/enum/time-to-live.enum`, which does not exist.
- **2 suites: 9 assertion failures.** `sync-carer.use-case.spec.ts` and
  `secondary-carer.consume-invitation-qr.use-case.spec.ts` expect old response
  messages and mock methods (`getByName`) that the use-cases no longer use.

**Typecheck failures (228).**

- **Source-level errors (17).** HeroUI Native API drift: `Divider` is no longer
  exported (`app-settings.tsx`, `carer-managment/index.tsx`), `TextField` parts
  (`Description`, `ErrorMessage`, `Input`, `InputEndContent`) and the `ripple`
  prop on `PressableFeedback` no longer exist in the installed version
  (`text-field.atom.tsx`, `card.atom.tsx`).
- **Test type drift (211).** Mocks no longer match domain entities.
  `tsconfig.json` includes `tests/**`, so `pnpm typecheck:src` reports them too
  and cannot currently serve as a source-only check; `pnpm typecheck` stops at
  the source config and never reaches `typecheck:tests`.

**E2E.** The parent-setup Detox flow taps `module-cic`, which does not exist in
the current module step, so it would fail even with a working native build.

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
