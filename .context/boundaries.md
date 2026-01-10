# Boundaries (What to modify / not modify)

This file defines **what is in scope** by default and what requires explicit confirmation.

If a requested change conflicts with these boundaries, stop and ask for confirmation (or propose an alternative that stays in bounds).

## Safe to modify (default)

- UI screens and components under `src/app/**` and `src/ui/**`.
- Domain hooks and use-cases under `src/domain/**` (but keep them pure and testable).
- DB adapters under `src/database/adapter/**`.

## Modify with caution (extra steps required)

- DB schema files under `src/database/schema/**`.
  - Schema changes require updating migrations (`pnpm db:generate`) and verifying adapters.
- Composition root & wiring (`src/app/_layout.tsx`, `src/adapter/index.ts`).
  - Changes must preserve the golden flow: UI → hooks → use-cases → ports ← adapters.
- Cross-cutting types and “core” building blocks (`src/domain/core/**`).
  - Prefer extending existing patterns over inventing new ones.

## Do not do (out of bounds)

- Do not move business logic into UI.
- Do not bypass ports/adapters by importing DB clients directly into domain/UI.
- Do not introduce new storage mechanisms for auth/session without updating [auth/overview.md](auth/overview.md) and [debt.md](debt.md).
- Do not add new dependencies without updating `.context/dependencies.md` and justifying why existing approved packages are insufficient.
- Do not change i18n key conventions (message keys are part of the contract with UI).

## Key architectural contracts

- `ICachePort` is used both for cache-like values and secure values.
- Adapters are wired in one place: [src/adapter/index.ts](../src/adapter/index.ts).
- DB bootstrapping happens in [src/app/_layout.tsx](../src/app/_layout.tsx) via `SQLiteProvider` and `useInitDb()`.

## When to ask before changing

- Any DB schema change that impacts existing tables/columns.
- Any change to `BaseUseCase`, error contracts, or `IBaseResponse` shape.
- Any change that affects auth/session security assumptions (SecureStore/MMKV, PIN, wipe-local-data).
