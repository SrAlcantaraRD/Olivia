---
applyTo: 'src/domain/**/*.dto.ts'
description: "Rules for defining domain DTOs for decoupling"
---

# Domain DTO Instructions

## Purpose
- Define transfer objects for decoupling layers, ensuring clean separation between domain and infrastructure.

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

### Example
  ```typescript
  export const <Root>CreateDTOSchema = GenerateCreateDTOSchema(<Root>EntitySchema);
  export const <Root>DTOSchema = GenerateDTOSchema(<Root>EntitySchema, {
    // Optional overrides or additions
    additionalField: z.string().optional(),
  });

  export type T<Root>CreateDTO = z.infer<typeof <Root>CreateDTOSchema>;
  export type T<Root>DTO = z.infer<typeof <Root>DTOSchema>;

  // Usage in adapter
  const createDto = <Root>CreateDTOSchema.parse(createData);
  const dto = <Root>DTOSchema.parse(entityData);
  ```
