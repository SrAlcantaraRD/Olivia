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

### Known install issue: pnpm 12 ignores `.npmrc` node-linker

`.npmrc` requests `node-linker=hoisted`, but pnpm 12 does not read that setting
from `.npmrc` (`pnpm config get node-linker` returns `undefined`). The repository's
Jest `transformIgnorePatterns` assumes hoisted paths, so with an isolated install
every Jest suite fails with:

```text
SyntaxError: Cannot use import statement outside a module
```

Until the configuration is moved to `pnpm-workspace.yaml` (`nodeLinker: hoisted`)
or the Jest pattern is made `.pnpm`-aware, reinstall with:

```bash
pnpm install --node-linker=hoisted
```

The CI workflow passes the same flag.

### Database changes

Migrations are generated with Drizzle and executed automatically on app start:

```bash
pnpm db:generate
```

Existing migrations under `src/database/migrations/` include the base schema and
the seeded CIC module and fields.

## Testing

The project uses Jest with React Native Testing Library for unit and integration
tests, and Detox for end-to-end flows.

```bash
pnpm test
pnpm test:coverage
pnpm exec biome ci .   # read-only format and lint check, as CI runs it
```

**Measured state (22 October 2026, local macOS, Node 25.8.1, pnpm 12.14.0):**

| Check | Result |
| --- | --- |
| `pnpm exec biome ci .` | Passes with 4 warnings (`noExplicitAny`) |
| `pnpm test` as configured | 0 of 79 suites run; install-layout error above |
| Jest with `.pnpm`-aware transform | 55 of 79 suites pass, 291 of 300 tests pass |
| `pnpm typecheck` | Fails: 228 errors while checking source (17 in source files, 211 in tests) |
| Coverage (when tests run) | 18.5% statements, 6.8% branches, 13.4% functions, 18.8% lines |
| Detox E2E | Not run in this environment; requires a native build |
| App build / launch | Not run in this audit (no simulator or device used) |

Known test failures (24 suites):

- 17 suites: `react-test-renderer` is pinned to `^19.3.1` while React is
  `19.1.0`, so React Native Testing Library rejects the mismatch.
- 4 suites: Zod 4.6 rejects `.omit()` on schemas with refinements in
  `base-dto.entity.ts` (a source-level incompatibility).
- 1 suite imports a module that does not exist
  (`@/domain/core/enum/time-to-live.enum`).
- 2 use-case suites (`sync-carer`, `secondary-carer.consume-invitation-qr`)
  have assertion/response drift and account for the 9 failing tests.

The Detox parent-setup flow also references a `module-cic` test ID that does not
exist in the UI.

Known typecheck failures (228 errors):

- 17 are in source files: HeroUI Native API drift (`Divider` no longer exported,
  `TextField` subcomponents, the `ripple` prop).
- 211 are test mocks that no longer match domain types. `tsconfig.json` includes
  `tests/**`, so `pnpm typecheck:src` reports them too, and `pnpm typecheck`
  stops there before running the test config.

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
summaries, caregiver management, QR sharing, themes and three languages), but the
native app was not built or launched in this audit, and the project is
pre-release with the quality debt above.

Near-term, in rough order:

1. Make the quality gates honest and green: fix the install/transform issue,
   align `react-test-renderer`, repair the two failing use-case suites, resolve
   test type drift, and raise coverage deliberately.
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
