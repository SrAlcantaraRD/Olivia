# Oliva App (TFG) — .context substrate

This folder is the “single source of truth” for **how this codebase works today**. The goal is to stop humans *and AI* from inventing endpoints, schemas, or architecture that does not exist in the repo.

If you’re about to implement a feature, refactor, or write tests: start here.

## Project context (TL;DR)

- **Runtime**: Expo + React Native + Expo Router (file-based routing)
- **Architecture**: Clean Architecture + Hexagonal (Ports & Adapters)
- **Persistence**: Local-first SQLite via Drizzle ORM (`drizzle-orm/expo-sqlite`)
- **UI**: HeroUI Native wrapped by local Atomic Design components (no direct HeroUI usage in screens)
- **Data fetching/state**: domain hooks + use-cases orchestrate async work; Zustand stores hold shared domain state (React Query is not a dependency)
- **Validation**: Zod (use-case request/response schemas)
- **I18n**: `i18next` + `react-i18next` with typed keys (no hardcoded strings in UI)

Key entry points in the actual repo:

- Composition root (providers, DB init): [src/app/_layout.tsx](../src/app/_layout.tsx)
- Adapter wiring (Ports → Adapters): [src/adapter/index.ts](../src/adapter/index.ts)
- Drizzle client + adapter client builder: [src/database/config/database.config.ts](../src/database/config/database.config.ts)

## Navigation

- Architecture
  - [System overview](architecture/overview.md)
  - [Dependency wiring (DI)](architecture/dependencies.md)
  - [Patterns & error handling](architecture/patterns.md)
- Authentication & security (local-first)
  - [Auth overview](auth/overview.md)
  - [Integration patterns](auth/integration.md)
  - [Security model](auth/security.md)
- “API surface” (internal ports + QR bundles)
  - [API overview](api/overview.md)
  - [Operations (“endpoints”)](api/endpoints.md)
  - [Metadata (“headers”)](api/headers.md)
  - [Examples](api/examples.md)
- Database (SQLite + Drizzle)
  - [Schema + ERD](database/schema.md)
  - [Models + validation](database/models.md)
  - [Migrations strategy](database/migrations.md)
- UI
  - [UI architecture](ui/overview.md)
  - [UI patterns](ui/patterns.md)
- SEO
  - [SEO / Web metadata](seo/overview.md)
- Project-wide rules
  - [Development guidelines](guidelines.md)
  - [Workflows (how we do tasks)](workflows.md)
  - [AI rules](ai-rules.md)
  - [Naming conventions](naming.md)
  - [Known technical debt](debt.md)
  - [Glossary](glossary.md)
  - [Prompts](prompts/)

## The golden flow (non-negotiable)

**UI (screens/components) → UI hooks → Domain use-cases → Ports ← Adapters (SQLite/SecureStore/Router/QR/Notify)**

If you see DB calls, SecureStore calls, or QR packing directly from UI, that’s a violation.

## Golden paths (copy these patterns)

- QR flow base: [src/domain/module/abstract/work-with-qr.use-case-abstract.ts](../src/domain/module/abstract/work-with-qr.use-case-abstract.ts)
- QR sync generation:
  - Use-case: [src/domain/core/use-case/generate-record-synchronization-qr.use-case.ts](../src/domain/core/use-case/generate-record-synchronization-qr.use-case.ts)
  - Schema: [src/domain/core/use-case-schema/generate-record-synchronization-qr.use-case-schema.ts](../src/domain/core/use-case-schema/generate-record-synchronization-qr.use-case-schema.ts)
- QR sync consumption:
  - Use-case: [src/domain/core/use-case/consume-record-synchronization-qr.use-case.ts](../src/domain/core/use-case/consume-record-synchronization-qr.use-case.ts)
  - Schema: [src/domain/core/use-case-schema/consume-record-synchronization-qr.use-case-schema.ts](../src/domain/core/use-case-schema/consume-record-synchronization-qr.use-case-schema.ts)
  - Unit tests: [tests/unit-test/domain/core/use-case/consume-record-synchronization-qr.use-case.spec.ts](../tests/unit-test/domain/core/use-case/consume-record-synchronization-qr.use-case.spec.ts)
- DTO + mocks:
  - DTO: [src/domain/core/dto/sync-record.dto.ts](../src/domain/core/dto/sync-record.dto.ts)
  - QR mocks: [tests/mocks/qr.dto.mock.ts](../tests/mocks/qr.dto.mock.ts)

## “Documentation as Code as Context” usage

This substrate is meant to be used as an *implementation companion*.

### How to prompt AI (copy/paste recipes)

When you ask an AI tool for changes, include:

1) which file(s) are in scope
2) which ports/use-cases are involved
3) the “golden flow” constraint
4) the tests you expect to exist

Example prompt (feature):

```text
Implement a new domain use-case to create a catheterization record.

Constraints:
- Use Clean + Hexagonal (UI -> hook -> use-case -> ports <- adapters)
- Validate input with Zod request schema
- Persist via existing Drizzle SQLite adapters
- Add unit tests for the use-case (Arrange/Act/Assert)

Relevant files:
- src/adapter/index.ts (adapters wiring)
- src/database/schema/*.database-schema.ts
- src/domain/**/use-case/*.use-case.ts
```

Example prompt (refactor):

```text
Refactor all use-cases to use BaseUseCase.parseRequest for Zod validation,
keeping behavior stable. Update tests accordingly.
```

### How to confirm “what exists” before coding

Before inventing types or flows, search the repo for the “real thing”:

```sh
pnpm -s biome:check
pnpm -s test
```

And look up the closest existing use-case/adapter pair.

## Decision history & trade-offs

### Why local-first + SQLite?

- Works offline by default (critical for daily routines).
- Reduces privacy exposure (no mandatory backend).
- Simplifies deployment (EAS builds + app stores).

Trade-off: cross-device collaboration requires a sync mechanism. This project chose **QR bundles** as the first sync primitive (see [api/overview.md](api/overview.md)).

### Why Ports & Adapters in a mobile app?

- Keeps domain logic testable without Expo/SQLite.
- Enables swapping implementation details (e.g., MMKV vs SecureStore cache).
- Forces consistent orchestration patterns via use-cases.

Trade-off: more files and “plumbing” than a typical RN app, but it pays off once the project grows.
