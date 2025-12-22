---
applyTo: 'src/domain/**/*.use-case-schema.ts'
description: "Rules for generating or modifying Use Case Request/Response Schemas"
---

# Domain Use Case Schema Instructions

## Purpose
- Define validated input/output contracts for use cases. Drive validation & OpenAPI.

## Artifacts
- `src/domain/**/use-case-schema/<action>.use-case-schema.ts`

## Naming
- Schemas: `Request<Action>Schema`, `Response<Action>Schema`
- Types: `T<Action>Request`, `T<Action>Response`
- File: `<action>.use-case-schema.ts`

## Rules
### Basic Structure
- Use Zod only.
- Define request and response schemas.
- Export types inferred from schemas.
- Use z.void() when not request|response schema are defined.

### Referencing
- Reference existing entity/DTO schemas.
- Do not duplicate structure manually.
- All relation references via ID fields.
- Use IDSchema when referencing entities.

### Constraints
- No business logic, no side effects, no any.
- Codacy scan after edits.

### Example
  ```typescript
  export const Request<Action>Schema = z.object({
    // define request shape
  });
  export const Response<Action>Schema = z.object({
    // item or items
  });
  export type T<Action>Request = z.infer<typeof Request<Action>Schema>;
  export type T<Action>Response = z.infer<typeof Response<Action>Schema>;
  ```
