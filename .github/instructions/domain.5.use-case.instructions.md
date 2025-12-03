---
applyTo: "**/*.use-case.ts,**/*.use-case.spec.ts,**/*.use-case.test.ts"
description: "Template & rules for Domain Use Cases (copied from existing instruction artifact)."
---
````instructions
# Use Cases — Consolidated

This artifact has been consolidated into the canonical architecture guide.

See: `docs/architecture/condensed-copilot-guide.md` — section "Domain: Use Cases" for canonical use-case structure, input validation, and orchestration patterns.

Original content archived at: `.github/artifacts/archive/1.domain__5.use-case.instructions.md`

If you need the original full text, open the archive file above or check Git history.
---
applyTo: "**/*.use-case.ts,**/*.use-case.spec.ts"
description: "Template & rules for generating or modifying Domain Use Cases and their tests. (Supersedes combined use-case.md sections)"
---

# Use Case Generation Instructions

## Purpose
Encapsulate a single business action: validate input, orchestrate ports, apply domain rules, map entities to DTOs (via mappers), return standardized response.

## Artifacts
- `<action>.use-case.ts`
- `<action>.use-case.spec.ts`

## Naming
- File: `kebab-case` (`create-map-movement.use-case.ts`)
- Class: PascalCase + `UseCase` (`CreateMapMovementUseCase`)
- Test: same base + `.spec.ts`

## Implementation Rules
- Extend `BaseUseCase<TRequest, TResponse>`
- Validate with `checkSchemaOrThrow(Request<Action>Schema, request)`
- Inject only required ports via constructor (private readonly)
- NO framework / DB / logging logic (delegate through ports)
- Keep `execute` readable; extract helpers for branching logic
- When entity not found, throw `ErrorEntityNotFoundBy` if applicable

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
      status: HTTP_STATUS_CODE.OK_200,
      message: '<action>.success',
      details: { /* item|items */ },
    } satisfies IBaseResponse<TResponse<Action>>;
  }
}
```

## Response Contract
Always return `IBaseResponse<TResponse<Action>>` with: `success | status | message | details?`.
Negative paths prefer throwing domain errors (mapped by controller/middleware).

## Tests
### Required Cases
1. Happy path (all port calls asserted, response shape correct)
2. Each negative path: not found / validation / conflict / unauthorized (where applicable)
3. Early exit branches (if any) covered
4. Assert the response shape and values.

## Kafka Integration Pattern
When a use case needs to publish events to Kafka:

### Port Injection
```typescript
export class <Action>UseCase extends BaseUseCase<TReq, TRes> {
  constructor(
    private readonly <entity>Adapter: I<Entity>Port,
    private readonly messageAdapter: IMessagePort, // ← Inject for Kafka
  ) { super(); }

  async execute(request: TReq): Promise<IBaseResponse<TRes>> {
    // ... domain logic

    // Publish event after successful operation
    const message: T<Event>KafkaMessage = {
      correlationId: entity.uuid,
      eventId: generateUUID(),
      occurredAt: new Date().toISOString(),
      producer: {
        application: APPLICATION.TPS,
        service: SERVICE.TPS_DICTATOR,
      },
      payload: {
        entityUUID: entity.uuid,
        // event-specific data
      },
    };

    // Validate before producing
    checkSchemaOrThrow(<Event>KafkaMessageSchema, message);

    await this.messageAdapter.produce(
      KAFKA_TOPICS.<CONTEXT>.<EVENT>,
      message
    );

    return { success: true, status: HTTP_STATUS_CODE.OK_200, details: { ... } };
  }
}
```

## Quality Gates
- 100% branch coverage of conditional branches
- No adapter / database imports
- No `any` / suppressions
- Codacy scan after edits

````
