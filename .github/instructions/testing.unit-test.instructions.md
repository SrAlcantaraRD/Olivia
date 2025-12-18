---
applyTo: 'tests/unit-test/domain/**/*.spec.ts'
description: 'Unit test rules (fast, isolated, deterministic)'
---

# Unit Test Instructions (LLM)

## Goal
Fast tests that validate one unit (use-case, hook logic, adapter logic) with **no real IO**.

## Where
- Domain/{{use-cases|hooks}}: `tests/unit-test/domain/**`
- DB adapters (pure logic / query-shaping only): `tests/unit-test/database/**`

## Naming
- `describe('[UseCase|Hook|Adapter] - <Action>', ...)` and `it('does X when Y', ...)`.

## Mandatory Template
All unit test files MUST follow this exact header structure:

### For Use Cases and Adapters
```typescript
describe('[UseCase|Adapter] - <Action>', () => {
  const prepareSuiteCase = () => {
    // Arrange
    const portA = mockPortA();
    const portB = mockPortB();
    const unit = new <Action>UseCase(portA, portB); // or adapter
    return { unit, portA, portB };
  };

  beforeEach(() => jest.clearAllMocks());
  // ... tests here
});
```

### For Hooks
```typescript
describe('[Hook] - <Action>', () => {
  const prepareSuiteCase = () => {
    // Arrange
    const portA = mockPortA();
    const portB = mockPortB();
    const adapters = { portA, portB };
    const { result } = renderHook(() => use<Action>Hook(adapters));
    return { hook: result.current, ...adapters };
  };

  beforeEach(() => jest.clearAllMocks());
  // ... tests here
});
```

- Replace `[UseCase|Hook|Adapter]` with the appropriate type.
- Use `prepareSuiteCase` to setup mocks and unit under test.
- Always include `beforeEach(() => jest.clearAllMocks());` for isolation.
- For hooks requiring React state, use `renderHook` in `prepareSuiteCase`.

## Arrange / Act / Assert
- Use explicit sections (comments or blank lines) and keep each test focused.
- Prefer table-driven tests for edge cases.

## Isolation rules
- **Mandatory use of mock functions** from `@/tests/mocks/<entity|port>.mock.ts` (e.g., `mockPortA()`, `mockEntityB()`).
- DO NOT create manual mocks or objects; always use the provided mock functions.
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
