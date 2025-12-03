---
applyTo: 'src/domain/**/*.dto.ts'
description: "Rules for defining domain DTOs for decoupling"
---

# Domain DTO Instructions

## Purpose
- Define transfer objects for decoupling layers, ensuring clean separation between domain and infrastructure.

## Artifacts
- `src/domain/**/dto/<root>.dto.ts`
- `test/unit-test/domain/**/mock/dto/<root>.dto.mock.ts`

## Naming
- Schema: `<Root>DTOSchema`, `<Root>CreateDTOSchema`
- Types: `T<Root>DTO`, `T<Root>CreateDTO`

## Rules
### Basic Structure
- Use `GenerateDTOSchema` helper to create read DTO schemas from entity schemas.
- Use `GenerateCreateDTOSchema` helper to create create DTO schemas from entity schemas.
- DTOs must be derived from entity schemas for consistency and type safety.
- Define DTO schemas as `<Root>CreateDTOSchema` and `<Root>DTOSchema` (or `<Root>ReadDTOSchema`).
- Type as `T<Root>CreateDTO = z.infer<typeof <Root>CreateDTOSchema>` and `T<Root>DTO = z.infer<typeof <Root>DTOSchema>`.

### Validation
- Ensure DTOs are validated with Zod for data integrity.
- Use i18n keys for error messages in the format "validation.<root>.<field>.<constraint>.<type>".
- Apply constraints as needed for transfer validation.

### Usage
- Transform data between layers using DTOs.
- DTOs must decouple domain from infrastructure; avoid exposing internal details.
- Never use DTOs for business logic; only for data transfer.

### Do / Avoid
| Do | Avoid |
|----|-------|
| Use zod for schema | Re-declaring entity fields manually |
| Keep contract minimal | Exposing DB identifiers |
| Use optional nested DTOs | Eagerly embedding large graphs |

### Relations
- Lists: `<RelatedEntity>List? : TRelatedEntity[]`
- Single: `<RelatedEntity>? : TRelatedEntity`

## Quality Gates
- No `any`/`unknown`
- No internal `id`
- Must export schemas + types
- Run Codacy after edits

## Examples

### Entity
  ```typescript
  export const <Root>CreateDTOSchema = GenerateCreateDTOSchema(<Root>EntitySchema);
  export const <Root>DTOSchema = GenerateDTOSchema(<Root>EntitySchema, {
    // Optional overrides or additions
    additionalField: z.string().optional(),
  });

  export type T<Root>DTO = z.infer<typeof <Root>DTOSchema> & {
    // reference to other entities.
    <RelatedEntity>?: T<RelatedEntity>DTO;
    <RelatedEntity>List?: T<RelatedEntity>DTO[];
  };

  export type T<Root>CreateDTO = z.infer<typeof <Root>CreateDTOSchema>;

  // Usage in adapter
  const createDTO = <Root>CreateDTOSchema.parse(createData);
  const dto = <Root>DTOSchema.parse(entityData);
  ```

### Mock Factories
```ts
export function mock<Root>DTO(overrides: Partial<T<Root>DTO> = {}): T<Root>DTO {
  /* build deterministic mock */
  id: 1,
  // other fields...
  ...overrides,
  }
```
