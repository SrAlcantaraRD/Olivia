# Naming conventions

This repo uses suffix-based naming to make architecture boundaries obvious.

## Files

- Domain
  - `*.entity.ts` — domain entities + Zod schemas
  - `*.dto.ts` — data transfer objects (often for QR payloads)
  - `*.enum.ts` — domain enums
  - `*.port.ts` — ports (interfaces) used by use-cases
  - `*.use-case-schema.ts` — Zod request/response schemas for a use-case
  - `*.use-case.ts` — use-case implementation
  - `*.hook.ts` — React hooks wrapping use-cases (in this repo, many live under `src/domain/**/hook/*`)
  - `*.error.ts` — domain error types
- Database
  - `*.database-schema.ts` — Drizzle table definitions (SQLite)
  - `sqlite.*.adapter.ts` — Drizzle adapters implementing domain ports
- UI
  - `*.atom.tsx` — atomic design atoms (wrap HeroUI Native)
  - `*.molecule.tsx`, `*.organism.tsx`, etc.
  - `*.layout.tsx` — screen-level layout components

## Symbols

- Ports are prefixed with `I*Port` (e.g., `ICachePort`, `INavigationPort`).
- Adapters are concrete classes named `*Adapter` (e.g., `SecureStoreCacheAdapter`, `SQLiteRecordAdapter`).
- Use-cases are `PascalCase...UseCase` (e.g., `SetupParentUseCase`).

## Routing

Expo Router groups are used for navigation:

- Tabs: `src/app/(tabs)/*`
- Onboarding: `src/app/(onboarding)/*`

The initial route is configured in [src/app/_layout.tsx](../src/app/_layout.tsx).

## Database identifiers

- Drizzle uses `snake_case` column names in SQLite (e.g., `created_at`, `pin_hash`).
- Tables use `snake_case` (e.g., `module_field`, `record_field`).
