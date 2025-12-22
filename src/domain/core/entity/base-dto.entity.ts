import type { z } from 'zod';

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
    status: true,
    createdAt: true,
  }) as unknown as ZodCreateSchema<T>;
};

export type CreateFrom<T extends z.ZodTypeAny> = Omit<
  z.infer<T>,
  'id' | 'status' | 'createdAt'
>;
