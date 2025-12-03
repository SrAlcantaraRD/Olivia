---
applyTo: 'src/domain/**/*.entity.ts'
description: "Rules for defining domain entities with Zod schemas"
---

# Domain Entity Instructions

## Purpose
- Define domain entities that are technology-agnostic, with robust Zod schemas for data validation and security.

## Rules
### Basic Structure
- Entities must use Zod schemas extending BaseEntitySchema.
- BaseEntitySchema must include id, uuid, status, createdAt, deletedAt.
- Define schema as `<Root>EntitySchema`.
- Type as `T<Root>Entity = z.infer<typeof <Root>EntitySchema>`.
- Use STATUS_ENUM for status values.
- Domain layer must remain technology-agnostic; all infrastructure adapts to domain.

### Advanced Constraints
- Always include constraints for security: .min(), .max(), .email(), .regex(), .int(), .positive().
- Chain constraints for incremental validation (e.g., z.string().min(3).max(50).regex(/^[a-zA-Z\s]+$/)).
- Use i18n keys for error messages in the format "validation.<root>.<field>.<constraint>.<type>" (e.g., "validation.task.name.min.error").

### Refinements
- Apply .refine() for custom logic, e.g., passwords with numbers or complex rules.
- Ensure refinements enhance security without exposing sensitive logic.

### Error Handling
- Use safeParse() for validation to avoid throwing errors.
- Format errors with .format() for clear, field-specific feedback.
- Handle ZodError instances gracefully in adapters.

### Type Inference
- Always use z.infer to derive TypeScript types from schemas.
- Ensure types stay synchronized with validation rules.

### Example
  ```typescript
  export const <Root>EntitySchema = z.object({
    ...BaseEntitySchema.shape,
    name: z.string().min(3, "validation.<root>.name.min.error").max(50, "validation.<root>.name.max.error").regex(/^[a-zA-Z\s]+$/, "validation.<root>.name.regex.error"),
    email: z.string().email("validation.<root>.email.email.error"),
    age: z.number().int().positive("validation.<root>.age.positive.error"),
    password: z.string().min(8, "validation.<root>.password.min.error").refine(pwd => /\d/.test(pwd), "validation.<root>.password.refine.error"),
  });

  export const <Root>CreateEntitySchema = GenerateCreateEntitySchema(<Root>EntitySchema);

  export type T<Root>Entity = z.infer<typeof <Root>EntitySchema>;
  export type T<Root>CreateEntity = z.infer<typeof <Root>CreateEntitySchema>;
  ```
