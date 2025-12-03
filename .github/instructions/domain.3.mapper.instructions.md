---
applyTo: 'src/domain/**/*.mapper.ts'
description: "Rules for implementing mappers between entities and DTOs"
---

# Domain Mapper Instructions

## Purpose
- Implement mappers to transform between Entity and DTO, ensuring clean separation and type safety.

## Rules
### Basic Structure
- Implement `TBaseMapper<TEntity, TDTO>` interface.
- Define mapper as a const object with `toDTO` method (and optionally `toEntity` if needed).
- Name the mapper as `<root>Mapper`.
- Export as `export const <root>Mapper: TBaseMapper<T<Root>Entity, T<Root>DTO>`.

### Implementation
- Provide `toDTO` method to transform Entity to DTO.
- Ensure type safety with Zod-inferred types.
- Mappers must be pure functions without side effects.
- Map fields directly, omitting internal fields like `id`, including public ones like `uuid`.
- Handle relations conditionally: only map if present, using spread operator.
- For arrays, use `.map(otherMapper.toDTO)`.

### Usage
- Use mappers in adapters or use-cases for data transformation.
- Never mutate input entity or DTO.

### Example
  ```typescript
  export const <root>Mapper: TBaseMapper<T<Root>Entity, T<Root>DTO> = {
    toDTO: (entity: T<Root>Entity): T<Root>DTO => {
      return {
        uuid: entity.uuid,
        createdAt: entity.createdAt,
        // Map other fields
        name: entity.name,
        // Conditional relations
        ...(entity.relatedList && {
          relatedList: entity.relatedList.map(relatedMapper.toDTO),
        }),
      };
    },
  };
  ```
