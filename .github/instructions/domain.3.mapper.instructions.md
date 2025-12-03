---
applyTo: 'src/domain/**/*.mapper.ts'
description: "Rules for implementing mappers between entities and DTOs"
---

# Domain Mapper Instructions

## Purpose
- Implement mappers to transform between Entity and DTO, ensuring clean separation and type safety.

## Artifacts
- `src/domain/**/dto/<root>.dto.ts`
- `test/unit-test/domain/**/mapper/<root>.mapper.spec.ts`

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

## Quality Gates
- 100% branch coverage for conditional relation mapping.
- No `any` usage.
- Satisfies TypeScript type checks without casts (except localized test assertions).
- Codacy scan after edits.

### Example
  ```typescript
  export const <root>Mapper: TBaseMapper<T<Root>Entity, T<Root>DTO> = {
    toDTO: (entity: T<Root>Entity): T<Root>DTO => {
      return {
        uuid: entity.uuid,
        // Map other fields...

        // Conditional relations
        ...(entity.<relatedEntity>List && {
          <relatedEntity>List: entity.<relatedEntity>List.map(<relatedEntity>Mapper.toDTO),
        }),
        ...(entity.<relatedEntity> && {
          <relatedEntity>: <relatedEntity>Mapper.toDTO(entity.<relatedEntity>)
        }),
      } satisfies T<Root>DTO;
    },
  };
  ```

## Test
### Required Test Cases
1. Maps base fields (assert id not present in DTO)
2. Does NOT call related mappers when relations absent
3. Maps each relation when present (one test per relation)

### Example Skeleton
```ts
describe('<root>EntityToDTO', () => {
  it('maps base fields excluding id', () => {
    const entity = mock<Root>Entity();

    const dto = <root>EntityToDTO(entity);

    expect(dto).toHaveProperty('uuid');
    expect(dto).not.toHaveProperty('id');
  });

  it('does not map relation when missing', () => {
    const entity = mock<Root>Entity({
      <relatedEntity>: undefined,
      <relatedEntity>List: undefined
    });

    const <relatedEntity>MapperSpy = jest.spyOn(<relatedEntity>Mapper, 'toDTO');
    const <relatedEntity>MapperSpy = jest.spyOn(<relatedEntity>Mapper, 'toDTO');

    const dto = <root>EntityToDTO(entity);

    expect(dto.<relatedEntity>).not.toBeDefined();
    expect(dto.<relatedEntity>List).not.toBeDefined();

    expect(incomeTelegramMapperSpy).toHaveBeenCalledTimes(0);
    expect(incomeTelegramMapperSpy).toHaveBeenCalledTimes(0);
  });

  it('maps relation when provided', () => {
    const entity = mock<Root>Entity({
      <relatedEntity>: mock<relatedEntity>DTO,
      <relatedEntity>List: [
        mock<relatedEntity>DTO
      ]
    });

    const <relatedEntity>MapperSpy = jest.spyOn(<relatedEntity>Mapper, 'toDTO');
    const <relatedEntity>MapperSpy = jest.spyOn(<relatedEntity>Mapper, 'toDTO');

    const dto = <root>EntityToDTO(entity);

    expect(dto.<relatedEntity>).toBeDefined();
    expect(dto.<relatedEntity>List).toBeDefined();

    expect(incomeTelegramMapperSpy).toHaveBeenCalledTimes(1);
    expect(incomeTelegramMapperSpy).toHaveBeenCalledTimes(1);
  });
});
```
