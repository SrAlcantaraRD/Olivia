import { z } from 'zod';

import { ErrorCannotParseSchema } from '@/domain/core/error/cannot-parse-schema.error';

export enum MODULE_FIELD_TYPE_ENUM {
  TEXT = 'TEXT',
  SELECT = 'SELECT',
}

export const ModuleFieldTypeSchema = z.enum(MODULE_FIELD_TYPE_ENUM);

export const getModuleFieldTypeFromValue = (
  value: string
): MODULE_FIELD_TYPE_ENUM => {
  const types: MODULE_FIELD_TYPE_ENUM[] = Object.values(MODULE_FIELD_TYPE_ENUM);

  const type = types.find((column) => column === value.toUpperCase());

  if (typeof type === 'undefined') {
    throw new ErrorCannotParseSchema(
      'MODULE_FIELD_TYPE',
      `Value "${value}" is not a valid module field type.`
    );
  }

  return type;
};
