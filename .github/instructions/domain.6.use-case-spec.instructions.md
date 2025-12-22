---
applyTo: 'src/domain/**/*.use-case.spec.ts'
description: "Rules for writing Domain Use Case spec files with Arrange/Act/Assert"
---

# Domain Use Case Spec Instructions

## Purpose
- Standardize test writing for domain use cases. Ensure all business logic, port orchestration, and error paths are covered.

## Artifacts
- `test/unit-test/domain/**/use-case/<action>.use-case.spec.ts`

## Naming
- File: `<action>.use-case.spec.ts`
- Describe: `[UseCase] - <Action>`

## Rules
### Structure
- Use describe for context, it for scenarios.
- Each it: Arrange (setup mocks/data/use case), Act (invoke), Assert (verify result, calls, errors).
- Always use mocks for entity, port, and DTO to ensure isolated testing.

### Coverage
- Happy path (all ports called, response correct), negative paths (not found, validation, early exit).
- Port assertions: toHaveBeenCalledWith for args, toHaveBeenCalledTimes for counts.
- Error handling: expect(...).rejects.toThrow for thrown errors.
1. **Happy Path:**
   - All required ports called with correct arguments.
   - Response shape and values asserted.
   - No extraneous port calls.
2. **Negative Paths:**
   - Entity not found (throws domain error).
   - Validation error (if schema used).
   - Early exit branches (if any).
   - No side-effect port calls after early exit.
3. **Port Call Assertions:**
   - Use `toHaveBeenCalledWith` for all port calls.
   - Use `toHaveBeenCalledTimes` for dynamic count assertions (use fixture length, not magic numbers).
   - Assert ports not called in negative paths.
4. **Error Handling:**
   - Use `await expect(...).rejects.toThrow(<DomainError>)` for thrown errors.
   - Assert error message/code if mapped.

### Required Cases
- Happy path (all port calls asserted, response shape correct).
- Each negative path: not found / validation / conflict / unauthorized (where applicable).
- Early exit branches (if any) covered.
- Assert the response shape and values.

### Quality Gates
- 100% branch coverage, no magic numbers, Codacy scan.

### Example
```typescript
describe('[UseCase] - <Action>', () => {
  const prepareSuiteCase = () => {
    // Arrange
    const portA = mockPortA();
    const portB = mockPortB();
    const useCase = new <Action>UseCase(portA, portB);
    return { useCase, portA, portB };
  };

  beforeEach(() => jest.clearAllMocks());

  describe('Happy Path', () => {
    it('executes successfully', async () => {
      // Arrange
      const { useCase, portA, portB } = prepareSuiteCase();
      // ...setup mocks...
      // Act
      const response = await useCase.execute(request);
      // Assert
      expect(response.success).toBe(true);
      expect(portA.method).toHaveBeenCalledWith(expectedArgs);
      expect(portB.method).toHaveBeenCalledTimes(expectedCount);
    });
  });

  describe('Negative Path', () => {
    it('throws error when entity not found', async () => {
      // Arrange
      const { useCase, portA } = prepareSuiteCase();
      portA.method.mockResolvedValue(null);
      // Act & Assert
      await expect(useCase.execute(request)).rejects.toThrow('ErrorEntityNotFoundBy');
      expect(portA.method).toHaveBeenCalledWith(expectedArgs);
    });
  });
});
```
