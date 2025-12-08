import type { z } from 'zod';

/**
 * The function `GenerateDTOSchema` generates a new schema by omitting specific keys from an
 * input schema.
 * @param {T} schema - The `schema` parameter is an object representing a data schema. It likely
 * contains properties that define the structure of a data object, such as `id`, `deletedAt`,
 * `createdAt`, `status`, and `uuid`. The function `GenerateDTOSchema` takes this schema object
 * as input
 */
export type ZodDTOSchema<T extends z.ZodTypeAny> = z.ZodType<
  Omit<z.infer<T>, 'id' | 'status' | 'deletedAt'>
>;

export const GenerateDTOSchema = <T extends z.ZodObject>(
  schema: T
): ZodDTOSchema<T> => {
  return schema.omit({
    status: true,
  }) as unknown as ZodDTOSchema<T>;
};

/**
 * The function `GenerateCreateDTOSchema` generates a new schema by omitting specific keys from an
 * input schema.
 * @param {T} schema - The `schema` parameter is an object representing a data schema. It likely
 * contains properties that define the structur of a data object, such as `id`, `deletedAt`,
 * `createdAt`, `status`, and `uuid`. The function `GenerateCreateDTOSchema` takes this schema object
 * as input
 */
export type ZodCreateDTOSchema<T extends z.ZodTypeAny> = z.ZodType<
  Omit<
    z.infer<T>,
    'id' | 'uuid' | 'status' | 'deletedAt' | 'createdAt' | 'updatedAt'
  >
>;

export const GenerateCreateDTOSchema = <T extends z.ZodObject>(
  schema: T
): ZodCreateDTOSchema<T> => {
  return schema.omit({
    id: true,
    status: true,
  }) as unknown as ZodCreateDTOSchema<T>;
};

/**
 * NOTE: the strongly-typed variant is declared further below as `GenerateCreateEntitySchema`.
 * The original, untyped helper was removed to avoid duplicate declarations.
 */

/**
 * A Zod type representing a Create DTO schema derived from an entity schema `T`.
 * The runtime value is the result of `schema.omit(...)`, but this alias gives a
 * precise TypeScript view where the output / input type equals `CreateFrom<T>`.
 */
export type ZodCreateSchema<T extends z.ZodTypeAny> = z.ZodType<CreateFrom<T>>;

/**
 * Generates a strongly-typed Zod schema for creating a new entity by omitting audit
 * fields. The returned schema is typed as `ZodCreateSchema<T>` so TypeScript understands
 * the shape (`CreateFrom<T>`) even though `schema.omit(...)` returns a generic ZodObject.
 */
export const GenerateCreateEntitySchema = <T extends z.ZodObject>(
  schema: T
): ZodCreateSchema<T> => {
  return schema.omit({
    id: true,
    uuid: true,
    status: true,
    deletedAt: true,
    createdAt: true,
    updatedAt: true,
  }) as unknown as ZodCreateSchema<T>;
};

/**
 * Type helper to derive a Create-DTO TypeScript type from a Zod entity schema.
 * Example: `type TCreatePatient = CreateFrom<typeof PatientEntitySchema>`
 */
export type CreateFrom<T extends z.ZodTypeAny> = Omit<
  z.infer<T>,
  'id' | 'uuid' | 'status' | 'deletedAt' | 'createdAt' | 'updatedAt'
>;
