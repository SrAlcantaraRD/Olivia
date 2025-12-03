---
applyTo: 'src/domain/**/*.mapper.ts'
description: "Rules for implementing mappers between entities and DTOs"
---

# Domain Mapper Instructions

## Purpose
- Implement mappers to transform between Entity and DTO, ensuring clean separation and type safety.

## Artifacts
- `src/domain/**/mapper/<root>.mapper.ts`
- `test/unit-test/domain/**/mapper/<root>.mapper.spec.ts`

## Naming
- Mapper: `<root>Mapper`
- Interface: `TBaseMapper<T<Root>Entity, T<Root>DTO>`
- File: `<root>.mapper.ts`

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

### Testing
- Always create `<root>.mapper.spec.ts` for mapper functions.
- Test base field mapping (assert id not present in DTO).
- Test conditional relation mapping (present/absent).
- Example test cases: maps base fields excluding id, does not map relation when missing, maps relation when provided.

### Quality Gates
- 100% branch coverage for conditional relation mapping.
- No `any`/`unknown`
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

### Test Example
```ts
describe('<root>Mapper', () => {
  it('maps base fields excluding id', () => {
    const entity = mock<Root>Entity();

    const dto = <root>Mapper.toDTO(entity);

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

    const dto = <root>Mapper.toDTO(entity);

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

    const dto = <root>Mapper.toDTO(entity);

    expect(dto.<relatedEntity>).toBeDefined();
    expect(dto.<relatedEntity>List).toBeDefined();

    expect(incomeTelegramMapperSpy).toHaveBeenCalledTimes(1);
    expect(incomeTelegramMapperSpy).toHaveBeenCalledTimes(1);
  });
});
```
