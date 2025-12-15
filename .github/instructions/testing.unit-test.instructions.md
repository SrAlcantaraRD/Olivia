---
applyTo: 'tests/unit-test/domain/**/*.spec.ts,tests/unit-test/hooks/**/*.spec.ts,tests/unit-test/database/**/*.spec.ts'
description: 'Unit test rules (fast, isolated, deterministic)'
---

# Unit Test Instructions (LLM)

## Goal
Fast tests that validate one unit (use-case, hook logic, adapter logic) with **no real IO**.

## Where
- Domain/use-cases: `tests/unit-test/domain/**`
- Hooks (logic only): `tests/unit-test/hooks/**`
- DB adapters (pure logic / query-shaping only): `tests/unit-test/database/**`

## Naming
- `describe('[Unit] <Thing>', ...)` and `it('does X when Y', ...)`.

## Arrange / Act / Assert
- Use explicit sections (comments or blank lines) and keep each test focused.
- Prefer table-driven tests for edge cases.

## Isolation rules
- Use mock of **ports/entity** from `**/mocks.<entity|port>.ts`.
- DO NOT import or initialize native/expo runtime modules in unit tests.
- DO NOT call `openDatabaseSync`, `expo-sqlite`, filesystem, network, or real Drizzle drivers.

## Determinism
- No randomness; if needed, seed it.
- Assert exact outputs and interactions (`toHaveBeenCalledWith`).

## Assertions
- Validate success + failure paths.
- For errors: assert error type/class and message/metadata (not stack traces).

## Type safety
- No `any` in tests.
- No casting like `as <interface|type>` at least a typed escape hatch (`as <type> ...`) with a reason.
- Keep mocks typed (Always use interface types from Domain).
