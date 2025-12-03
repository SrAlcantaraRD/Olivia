---
applyTo: "**/*.use-case-schema.ts,**/*.use-case-schema.spec.ts"
description: "Template & rules for Use Case Schemas (copied from existing instruction artifact)."
---
````instructions
# Use-Case Schemas — Consolidated

This artifact has been consolidated into the canonical architecture guide.

See: `docs/architecture/condensed-copilot-guide.md` — section "Domain: Use Case Schemas & Validation" for canonical patterns and examples.

Original content archived at: `.github/artifacts/archive/1.domain__6.use-case-schema.instructions.md`

If you need the original full text, open the archive file above or check Git history.
---
applyTo: "**/*.use-case-schema.ts"
description: "Template & rules for generating or modifying Use Case Request/Response Schemas."
---

# Use Case Schema Generation Instructions

## Purpose
Define validated input/output contracts for a use case. Drive runtime validation & OpenAPI generation.

## Artifacts
- `<action>.use-case-schema.ts`

## Naming
- File: `kebab-case` + `.use-case-schema.ts`
- Exports: `Request<Action>Schema`, `Response<Action>Schema`, `TRequest<Action>`, `TResponse<Action>`

## Implementation Rules
- Use TypeBox only
- Reference existing entity / DTO schemas
- DO NOT duplicate structure manually
- All relation references via UUID fields (not embedded entity)
- Use IDSchema when referencing entities
- Use UUIDSchema when referencing entities by UUID

```typescript
export const Request<Action>Schema = z.object({
  // define request shape fields
});

export const Response<Action>Schema = z.object({
  // item or items
  // details: { item?: <Root>DTOSchema, items?: z.array(<Root>DTOSchema) }
});

export type TRequest<Action> = z.input<typeof Request<Action>Schema>;
export type TResponse<Action> = z.input<typeof Response<Action>Schema>;
```

## Validation Helpers
Use `checkSchemaOrThrow(Request<Action>Schema, request)` inside use case.

## Quality Gates
- No business logic
- No side effects
- No `any`
- Codacy scan after edits

````
