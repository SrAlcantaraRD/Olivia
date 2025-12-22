---
applyTo: 'tests/integration/**/*.integration.spec.ts'
description: 'Integration test rules (real DB, real adapters, minimal mocking)'
---

# Integration Test Instructions (LLM)

## Goal
Validate a vertical slice with **real adapters** and a **real SQLite database**.

## Where
- Place files under `tests/integration/**` and name `*.integration.spec.ts`.
- Prefer grouping by layer: `tests/integration/database/adapter/<name>.integration.spec.ts`.

## Naming
- `describe('[Integration] <Slice>', ...)` with scenario-focused `it(...)`.

## Environment guard
- If the test is slow or uses disk DB, gate it behind `process.env.TPS_INTEGRATION_TESTS === 'true'`.
- When not enabled, `describe.skip(...)`.

## Database rules
- Use `better-sqlite3` + `drizzle-orm/better-sqlite3` in Node.
- DO NOT use `expo-sqlite` in integration tests (native dependency).
- Apply migrations from `src/database/migrations/**` before assertions.
- Use an isolated DB per test (tmp file or in-memory) and clean up after.

## Mocking rules
- DO NOT mock Drizzle ORM.
- You may stub truly external systems (network/Kafka) at the boundary.

## Required cases
- Happy path: writes + reads back.
- Negative path: invalid input or missing entity.
- Error handling: constraint violation / transaction rollback when applicable.

## Assertions
- Assert persisted state (query DB) and returned domain entities.
- Assert ordering/aggregation queries with known fixtures.
- Avoid snapshots; prefer explicit field comparisons.
