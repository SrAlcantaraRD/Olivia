# Workflows (how we do tasks)

These are the default step-by-step workflows to keep changes consistent, small, and testable.

If a request conflicts with these workflows, stop and clarify constraints before coding.

## Workflow: Fix a bug

1. Reproduce (or add a failing unit test) in `tests/unit-test/**` when feasible.
2. Locate the closest existing pattern (`rg` for the use-case/port/adapter).
3. Apply the smallest fix that addresses the root cause.
4. Run targeted tests + `pnpm biome:check`.
5. Update `.context/debt.md` only if you discovered or confirmed an existing debt item.

## Workflow: Add a domain use-case

1. Find a reference use-case + schema + spec (golden path).
2. Create request/response schemas in `src/domain/**/use-case-schema/*.use-case-schema.ts`.
3. Implement use-case in `src/domain/**/use-case/*.use-case.ts`:
   - Validate → call ports → return `IBaseResponse<T>` with i18n `message`.
4. Add unit tests under `tests/unit-test/domain/**/use-case/*.spec.ts` (AAA).
5. If new external capability is needed: add/extend a port + implement adapter + wire in `src/adapter/index.ts`.

## Workflow: Add/modify an adapter

1. Confirm the port contract (`src/domain/**/port/*.port.ts`) and existing adapters.
2. Implement adapter in the correct layer:
   - DB: `src/database/adapter/**`
   - Platform/services: `src/adapter/**`
3. Wire it through `useAdapters()` in `src/adapter/index.ts`.
4. Add/adjust unit tests (mock the port in use-case tests; adapter tests only when valuable).

## Workflow: Change the database schema

1. Update `src/database/schema/**`.
2. Generate/update migrations (`pnpm db:generate`) and verify boot/migration path.
3. Update adapters affected by the schema change.
4. Run tests and sanity-check basic flows.

## Workflow: Refactor

1. State the invariant (what must not change).
2. Make mechanical changes in small commits/patches.
3. Keep behavior stable: tests should stay green throughout.
4. Update `.context/architecture/patterns.md` only if the refactor changes a documented pattern.

