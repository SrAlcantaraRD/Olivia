---
applyTo: 'src/domain/**/*.use-case.ts'
description: "Rules for generating or modifying Domain Use Cases and their tests"
---

# Domain Use Case Instructions

## Purpose
- Encapsulate single business actions: validate input, orchestrate ports, apply rules, map to DTOs.

## Artifacts
- `src/domain/**/use-case/<action>.use-case.ts`

## Naming
- Class: `<Action>UseCase`
- File: `<action>.use-case.ts`
- Request/Response: `T<Action>Request`, `T<Action>Response`

## Rules
### Basic Structure
- Extend `BaseUseCase<TRequest, TResponse>`.
- Inject required ports via constructor.
- Implement `execute(request: TRequest): Promise<IBaseResponse<TResponse>>`.
- Keep `execute` readable; extract helpers for branching logic
- When entity not found, throw `ErrorEntityNotFoundBy` if applicable

### Validation
- Validate input with `checkSchemaOrThrow(Request<Action>Schema, request)`.
- Throw domain errors when invariants are broken.

### Execution
- Orchestrate ports for data access.
- No framework/DB/logging logic.
- Keep execute readable; extract helpers if needed.
- Apply business rules.

### Response
- Return `IBaseResponse<TResponse>` with success, status, message, details.

### Quality Gates
- 100% branch coverage.
- No `any` or `unkown` usage.
- Codacy scan after edits.

### Example
```typescript
export class <Action>UseCase extends BaseUseCase<TRequest<Action>, TResponse<Action>> {
  constructor(
    private readonly <root>Adapter: I<Root>Port,
    // other ports
  ) { super(); }

  public async execute(request: TRequest<Action>): Promise<IBaseResponse<TResponse<Action>>> {
    checkSchemaOrThrow(Request<Action>Schema, request);

    // 1. Gather
    // 2. Validate domain invariants
    // 3. Persist / mutate via ports
    // 4. Map entities -> DTOs
    // 5. Return standardized response
    // 6. Write private function to keep execute() clean and human readable

    return {
      success: true,
      message: '<action>.success',
      details: { /* item|items */ },
    } satisfies IBaseResponse<TResponse<Action>>;
  }
}
```
