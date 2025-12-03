---
applyTo: "**/*.mapper.ts,**/*.mapper.spec.ts,**/*.mapper.test.ts"
description: "Template & rules for Domain Mappers (copied from existing instruction artifact)."
---
````instructions
# Domain Mappers — Consolidated

This artifact has been consolidated into the canonical architecture guide.

See: `docs/architecture/condensed-copilot-guide.md` — section "Domain: Mappers & Mapping" for canonical mapper patterns and examples.

Original content archived at: `.github/artifacts/archive/1.domain__3.mapper.instructions.md`

If you need the original full text, open the archive file above or check Git history.
---
applyTo: "**/*.mapper.ts,**/*.mapper.spec.ts"
description: "Template & rules for generating or modifying Domain Mappers (Entity <-> DTO) plus associated mapper tests."
---

# Mapper & Mapper Test Instructions

## Purpose
Pure transformation between domain entities and DTOs. Encapsulate exposure rules (omit `id`, include `uuid`).

## Artifacts
- `<root>.mapper.ts`
- `<root>.mapper.spec.ts`

## Naming
- Functions: `<root>EntityToDTO(entity: T<Root>Entity): T<Root>DTO`
- (If needed) `<root>CreateDTOToEntity(dto: T<Root>CreateDTO): T<Root>CreateEntity>`

## Implementation Rules
- No side effects / logging.
- Conditional mapping for related entities only if loaded.
- Never mutate input entity.
- Use spread patterns for conditional relations.


```ts
export const PLCMapper: TBaseMapper<TPLCEntity, TPLCDTO> = {
  toDTO: (entity: TPLCEntity): TPLCDTO => {
    return {
      uuid: entity.uuid,
      // ...other fields

      // relations (only included when loaded)
      ...(entity.incomeTelegramList && {
        incomeTelegramList: entity.incomeTelegramList.map(PLCMapper.toDTO),
      }),
    } satisfies TPLCDTO;
  },
};
```


## Negative Cases
- If relation absent, property omitted (not `null`).

## Tests
File: `<root>.mapper.spec.ts`

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
    const entity = mock<Root>Entity({ related: undefined });
    const dto = <root>EntityToDTO(entity);
    expect(dto.related).toBeUndefined();
  });

  it('maps relation when provided', () => {
    const related = mockRelatedEntity();
    const entity = mock<Root>Entity({ related });
    const spy = jest.spyOn(module, 'relatedEntityToDTO');
    const dto = <root>EntityToDTO(entity);
    expect(dto.related).toBeDefined();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
```

To runt test:

```sh
  node tools/scripts/nx-jest-run-file-dynamic.cjs '<path-to-spec>' -c '<path-to-jest-config>' -t '<test name regex>'
```

## Quality Gates
- 100% branch coverage for conditional relation mapping.
- No `any` usage.
- Satisfies TypeScript type checks without casts (except localized test assertions).
- Codacy scan after edits.

````
