# Olivia

Olivia is a **local-first mobile app for recording pediatric intermittent
catheterization (CIC) and other recurring care tasks** — for example stool
records, enemas and medication — and for reviewing them as trends and
summaries.

It is built for families who need one consistent place for day-to-day care
information, and for the professionals who later need to understand what
happened. Everything is stored on the device: there is no account, no server
and no telemetry.

> **Status: early-stage / pre-release.** Olivia is an academic final degree
> project (TFG) that is being prepared for open-source development. It is not a
> medical device, has not been clinically validated, and is not ready for
> clinical use. See [Status and roadmap](#status-and-roadmap).

- [Why this exists](#why-this-exists)
- [What works today](#what-works-today)
- [What is not implemented](#what-is-not-implemented)
- [Architecture](#architecture)
- [Requirements](#requirements)
- [Setup](#setup)
- [Testing](#testing)
- [Privacy and security](#privacy-and-security)
- [Status and roadmap](#status-and-roadmap)
- [Documentation](#documentation)
- [Contributing, security and license](#contributing-security-and-license)

## Why this exists

Care for a child with a chronic condition produces a constant stream of small,
time-stamped events. When that information lives in paper notes, chat threads
and memory, it is hard to see patterns, hard to answer a clinician's question
precisely, and hard to know who recorded what.

Olivia explores a smaller, more controllable answer:

- record a care event in seconds, offline;
- keep the data on the family's device;
- turn records into summaries that can be reviewed over time;
- share a copy device-to-device through QR codes, without a cloud account.

The project does not claim to replace clinical judgement or a medical record
system.

## What works today

Olivia targets iOS and Android through Expo, with light/dark themes and English,
Spanish and Catalan UI. This audit did not build or launch the native app.

**Onboarding**

- Welcome slides and role selection (parent/guardian or caregiver/professional).
- Parent setup wizard: caregiver details, child profile (name, birth date,
  optional diagnosis), module selection, and a review step.
- The setup creates the caregiver and child locally and activates the selected
  care modules in one flow.

**Care modules and records**

- A module engine stored in SQLite: modules define their own fields and field
  types (`module`, `module_field`, `record`, `record_field`).
- A seeded CIC module (catheterizations) with its fields.
- A record wizard under the **Register** tab for entering a care event.
- Soft status and audit columns (`status`, `created_at`) on domain tables.

**Summaries**

- A **Summary** tab with per-module cards for the current week.
- Module detail screens with field-level detail, charts, distributions and
  statistics over selectable periods (today, 7, 30 and 90 days).
- Field pinning in summaries (UI text: "Pin to Summary").

**Caregivers and device-to-device sharing**

- Caregiver list, creation and deletion.
- Invitation QR codes for a secondary caregiver.
- Record synchronization QR codes: generate a payload on one device, scan it on
  another. QR payloads are deflate-compressed and base64-encoded, split into
  chunks of a configurable size.

**Settings**

- App settings: theme and language.
- Caregiver management, record synchronization, log-out.
- Log-out wipes local data (database, cache and session) — this is destructive
  and has no undo.
- A demo-data generator that fills active modules with synthetic records; useful
  for development, but it writes several hundred days of fake records into the
  local database.

**Child profile** and **About** screens are placeholders today.

## What is not implemented

These are important to know before evaluating or deploying the app:

- **No cloud, accounts, remote sync, analytics or crash reporting.** There is no
  network API in the codebase. QR sharing is manual and device-to-device.
- **No PIN or biometric lock.** The data model has a `pin_hash` column and the
  cache has a PIN key, but no screen sets or verifies a PIN; new caregivers are
  created with an empty hash. The app relies on the operating system's device
  lock and app sandbox.
- **No access control between caregivers.** A secondary caregiver receives a
  local copy of the data through a QR code; the app does not enforce per-record
  permissions, revocation, or an audit trail of who viewed what.
- **No notifications or reminders.** `expo-notifications` is not a dependency.
- **No export** (PDF/CSV) and no integration with clinical systems.
- **No encryption at rest beyond the platform sandbox.** SQLite is opened with
  `expo-sqlite` without SQLCipher; device backups may include the database.
- **No clinical validation, regulatory clearance or production readiness.**
  Nothing in this repository is evidence of compliance with HIPAA, GDPR, MDR or
  any other regime.
- **Test, typecheck and CI debt** is described in [Testing](#testing). The
  project is not yet at a green quality gate.

## Architecture

Olivia follows a Clean/Hexagonal structure. The dependency direction is:

```text
UI (src/app, src/ui)
  → domain hooks (src/domain/*/hook)
    → use-cases (src/domain/*/use-case)
      → ports (src/domain/*/port)
        ← adapters (src/database/adapter, src/adapter)
```

- **Domain is pure TypeScript and Zod.** It has no Expo or React Native imports,
  with one deliberate exception: the domain owns the React hook layer in
  `src/domain/**/hook`.
- **Database access lives only in `src/database/adapter/**`.**
- **Platform storage is reached through ports** such as `ICachePort`; UI code
  does not call SecureStore or MMKV directly.
- **Use-cases validate input with Zod** and return `IBaseResponse<T>`
  (`success`, `message`, optional `details`).
- **UI components use Atomic Design** and wrap third-party primitives instead of
  using them directly in screens.

```text
src/
├── app/                     Expo Router screens
│   ├── (onboarding)/        welcome, role selection, parent and carer setup
│   └── (tabs)/              summary, register, settings
├── domain/
│   ├── carer/               caregivers, invitations, local session
│   ├── patient/             child profile
│   ├── module/              module/record engine and statistics
│   ├── summary/             summary projections
│   └── core/                shared entities, ports, stores, logging, settings
├── database/
│   ├── schema/              Drizzle table definitions
│   ├── migrations/          generated SQL migrations and seeds
│   ├── adapter/             SQLite implementations of domain ports
│   └── execute-migrations.ts
├── adapter/                 navigation, SecureStore, QR, toast adapters
├── ui/                      atoms, molecules, organisms, i18n, themes
└── constants/               app-wide constants

tests/
├── unit-test/               Jest unit tests mirroring src/
├── integration/             database integration tests
├── unit/                    legacy test location
├── e2e/                     Detox flows (not run in CI)
└── mocks/                   shared mocks
```

**Runtime composition.** `src/app/_layout.tsx` opens the SQLite provider, runs
migrations, and installs providers for theming, gestures, keyboard handling,
HeroUI Native, toasts and i18n. `src/adapter/index.ts` is the composition root:
it constructs the SQLite, SecureStore, navigation, notify/toast and QR adapters
and exposes them through `useAdapters()`.

**Data model.** `carer`, `patient`, `module`, `module_field`, `record` and
`record_field`, with foreign keys, indexes and unique constraints. Timestamps are
stored as Unix seconds (`unixepoch()`). Migrations run automatically at startup;
if they fail, the app drops the local database and starts from an empty schema —
a recovery behaviour that also means potential data loss.

**Storage choices.** SQLite (Drizzle) is the source of truth. A SecureStore
adapter currently backs the `ICachePort` used for session values, preferences and
summary cache entries. An MMKV adapter exists but is not wired in.

**QR payloads.** `QrPortAdapter` compresses JSON with `pako`, encodes it as
base64 and chunks it. Payloads are **not encrypted or signed**; anyone who can
read a generated QR code can read its contents.

## Requirements

- **Node.js 24.11.0** — see [.nvmrc](.nvmrc); `nvm use` picks it up.
- **pnpm** — the only supported package manager. Do not use npm or yarn.
- Xcode and/or Android Studio for native simulators.
- An Expo account only if you build with EAS.

## Setup

```bash
pnpm install
pnpm start        # Expo dev server
pnpm ios          # iOS simulator
pnpm android      # Android emulator
pnpm web          # web target (configured, but native-only storage is not supported)
```

Useful scripts:

| Script | Purpose |
| --- | --- |
| `pnpm start` / `ios` / `android` / `web` | Start Expo for a target |
| `pnpm test` | Jest unit and integration tests |
| `pnpm test:coverage` | Jest with coverage |
| `pnpm test:ci` | Jest in CI mode (`--ci --coverage --maxWorkers=2`) |
| `pnpm typecheck` | TypeScript for source and tests |
| `pnpm typecheck:src` / `typecheck:tests` | The two TypeScript configs (the src config still includes tests) |
| `pnpm biome:check` | Format and lint with Biome (writes fixes) |
| `pnpm db:generate` | Generate a Drizzle migration from schema changes |
| `pnpm e2e:build:ios:debug` / `e2e:test:ios:debug` | Detox build and run (iOS) |

### Install layout

`pnpm-workspace.yaml` sets `nodeLinker: hoisted` and holds the dependency
`overrides` that pnpm 12 no longer reads from `package.json#pnpm`. Jest's
`transformIgnorePatterns` assumes hoisted paths, so install through pnpm as
usual:

```bash
pnpm install --frozen-lockfile
```

The CI workflow still passes `--node-linker=hoisted` explicitly; the committed
lockfile installs with both pnpm 12 and the pnpm 10 version pinned in CI.

### Database changes

Migrations are generated with Drizzle and executed automatically on app start:

```bash
pnpm db:generate
```

Existing migrations under `src/database/migrations/` include the base schema and
the seeded CIC module and fields.

### Native builds

Native projects are generated and git-ignored:

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

The cache port has an unused MMKV adapter, but the app-level persistence path
currently uses SecureStore; see `.context/ai-rules.md`.

- **Xcode 27 rejects pods whose deployment target is below 15.0** (for example
  SDWebImage 9.0, ReachabilitySwift 12.0 and RNSVG filters 12.4). Build the
  simulator target with `IPHONEOS_DEPLOYMENT_TARGET=15.1`, or clamp those targets
  in the generated Podfile. `ios/` is regenerated, so keep the workaround in
  tooling rather than only in the workspace.

`npx expo run:ios` also requires `Simulator.app`; when it is not installed, build
with `xcodebuild` and install with `simctl install` / `simctl launch`. The
exact commands used for the verified builds are in [TESTING.md](TESTING.md).

## Testing

The project uses Jest with React Native Testing Library for unit and integration
tests, and Detox for end-to-end flows.

```bash
pnpm test
pnpm test:coverage
pnpm exec biome ci .   # read-only format and lint check, as CI runs it
```

**Measured state (22 October 2026, local macOS, Node 25.8.1, pnpm 12.14.0, Xcode 27.1):**

| Check | Result |
| --- | --- |
| `pnpm exec biome ci .` | Passes with 4 warnings (`noExplicitAny`) |
| `pnpm install --frozen-lockfile` | Passes; hoisted layout from `pnpm-workspace.yaml` |
| `pnpm test` | 76 of 79 suites pass; 337 of 346 tests pass |
| `pnpm typecheck` | Fails: 146 errors, all in tests (0 in `src`) |
| `npx expo-doctor` | 18/18 checks pass |
| iOS release build | Builds and launches on iPhone 17 simulator (iOS 26.5) |
| Android debug build | Builds and launches on `Medium_Phone` emulator (Android 17, API 37) |
| Detox E2E | Not run; the parent-setup flow still references a missing `module-cic` test ID |

Coverage has not been re-measured since the dependency update; the last recorded
value was 18.5% statements.

Known test failures (3 suites, 9 tests):

- 1 suite imports a module that does not exist
  (`@/domain/core/enum/time-to-live.enum`).
- 2 use-case suites (`sync-carer`, `secondary-carer.consume-invitation-qr`)
  still expect old response messages and a `getByName` mock method.

Known typecheck failures (146 errors): all are test mocks that no longer match
domain types. `tsconfig.json` includes `tests/**`, so `pnpm typecheck:src`
reports them too.

Jest coverage thresholds are currently all `0`, despite older docs claiming 70%.
Do not report the suite as green until these items are fixed.

## Privacy and security

- Data is local to the device; there is no backend, analytics or crash
  reporting in the code. The app is configured for EAS Update (over-the-air
  JavaScript updates), so the client may contact Expo's update service; app code
  does not send care data anywhere.
- Local data includes the child's name, birth date, optional diagnosis and care
  records. Treat any device, backup or screenshot as sensitive.
- SecureStore holds session values and preferences; the SQLite database itself
  is not encrypted by the app.
- Debug logging builds a string containing the full parent-setup request,
  including the child's profile. The default `LOG_LEVEL=4` suppresses it, but
  lowering the level would write that data to the console or `logs.txt` on
  device. Production logging should be reviewed before any real-data use.
- QR synchronization payloads are compressed but not encrypted or signed.
- Logging out wipes local data without confirmation-based recovery; migration
  failure drops the database. Both behaviours can destroy records.

There is no security review, penetration test or compliance certification. For
reporting vulnerabilities, see [SECURITY.md](SECURITY.md).

## Status and roadmap

**Current state:** the core local flows are implemented (onboarding, records,
summaries, caregiver management, QR sharing, themes and three languages). The
native app builds and launches on iOS and Android simulators (verified 22
October 2026), but the project is still pre-release with the quality debt above.

Near-term, in rough order:

1. Make the quality gates honest and green: repair the three failing use-case
   suites, resolve test type drift, and raise coverage deliberately.
2. Add CI gates (lint is gated today; typecheck and tests are advisory until
   fixed) and a documented release checklist.
3. Review logging and data-at-rest protections before any real family data is
   recorded, and document the threat model.
4. Replace placeholder screens (child profile, about) and remove the demo-data
   generator from user-facing settings.
5. Unify naming: the repository says "Olivia", the UI says "Oliva", and the Expo
   project still uses "TFG"/`tfg-oliva` identifiers.

Longer-term ideas — a multi-user platform with a backend, explicit data-sharing
grants and professional notes — are **exploratory only and not implemented**.
They are described in
[docs/roadmap/prd-v2-cloud-platform.md](docs/roadmap/prd-v2-cloud-platform.md),
which is an unbuilt design draft, not a commitment or a compliance claim.

## Documentation

The design documentation is partly in Spanish. Start with the index at
[docs/README.md](docs/README.md). Highlights:

- [Architecture overview](.context/architecture/overview.md) — layers,
  composition root and data flow.
- [Architecture patterns](.context/architecture/patterns.md) — ports, adapters,
  hooks and conventions.
- [Domain model](docs/architecture/domain-driven-design.md) — ubiquitous language
  and bounded contexts.
- [Data model](docs/architecture/data-model.md) — tables and relationships.
- [Use cases](docs/architecture/use-cases.md) — main user flows.
- [Wireframes](docs/wireframe-screens/) — screen sketches with placeholder data.
- [Known technical debt](.context/debt.md) — tracked issues, including those
  above.
- [Testing strategy](TESTING.md) — detailed test layout and current limitations.
- [Git hooks](HOOKS.md) — what runs on commit and push.

`.context/` is the project's internal engineering context (constraints and
patterns used by both human and AI contributors). It is public, but it is written
for maintainers rather than as user documentation.

## Contributing, security and license

- [CONTRIBUTING.md](CONTRIBUTING.md) — setup, architecture rules, quality gates
  and pull-request expectations.
- [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) — community expectations.
- [SECURITY.md](SECURITY.md) — private vulnerability reporting and scope.
- [LICENSE](LICENSE) — MIT.

The dependency tree scanned during this audit contained no GPL/AGPL-only
licenses; the licenses present were MIT, ISC, BSD, Apache-2.0, MPL-2.0,
Artistic-2.0 and similar. The Inter font is distributed under the SIL Open Font
License (OFL-1.1); keep its notice when redistributing a branded build. This is
not legal advice.
