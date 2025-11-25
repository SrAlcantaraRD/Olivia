import type { z } from 'zod';

/**
 * The function `GenerateDTOSchema` generates a new schema by omitting specific keys from an
 * input schema.
 * @param {T} schema - The `schema` parameter is an object representing a data schema. It likely
 * contains properties that define the structure of a data object, such as `id`, `deletedAt`,
 * `createdAt`, `status`, and `uuid`. The function `GenerateDTOSchema` takes this schema object
 * as input
 */
export const GenerateDTOSchema = <T extends z.ZodObject>(schema: T) =>
  schema.omit({ id: true, status: true, deletedAt: true });

/**
 * The function `GenerateCreateDTOSchema` generates a new schema by omitting specific keys from an
 * input schema.
 * @param {T} schema - The `schema` parameter is an object representing a data schema. It likely
 * contains properties that define the structur of a data object, such as `id`, `deletedAt`,
 * `createdAt`, `status`, and `uuid`. The function `GenerateCreateDTOSchema` takes this schema object
 * as input
 */
export const GenerateCreateDTOSchema = <T extends z.ZodObject>(schema: T) =>
  schema.omit({
    id: true,
    uuid: true,
    status: true,
    deletedAt: true,
    createdAt: true,
    updatedAt: true,
  });

/**
 * Generates a schema for creating a new entity by omitting specific fields.
 * @param {T} schema - The input schema to generate the create entity schema from.
 */
export const GenerateCreateEntitySchema = <T extends z.ZodObject>(schema: T) =>
  schema.omit({
    id: true,
    uuid: true,
    status: true,
    deletedAt: true,
    createdAt: true,
    updatedAt: true,
  });
