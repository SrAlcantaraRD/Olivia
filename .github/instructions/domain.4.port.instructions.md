---
applyTo: 'src/domain/**/*.port.ts'
description: "Rules for defining domain ports as abstractions over external capabilities"
---

# Domain Port Instructions

## Purpose
- Define minimal abstractions for external capabilities needed by use cases, ensuring domain remains technology-agnostic.

## Artifacts
- `src/domain/**/port/<root>.port.ts`
- `test/unit-test/domain/**/mock/<root>.port.mock.ts`

## Naming
- Interface: `I<Root>Port`
- File: `<root>.port.ts`
- Mock File: `<root>.port.mock.ts`

## Rules
### Basic Structure
- Define port as interface `I<Root>Port`.
- Return domain entities, never DTOs.
- Use `T<Root>CreateEntity` for creation inputs.

### Method Naming
- Prefer explicit methods like `findByID`, `create`, `getAll`.
- Keep interface minimal and cohesive.
- Add methods only when required by use cases.

### Constraints
- No implementation logic or adapter imports.
- Ensure type safety with domain types.
- Codacy scan after edits.

### Example
  ```typescript
  export interface I<Root>Port {
    create(data: T<Root>CreateEntity): Promise<T<Root>Entity>;
    findByID(id: TID): Promise<T<Root>Entity | null>;
    getAll(): Promise<T<Root>Entity[]>;
  }
  ```
