import { z } from 'zod';

import { ErrorCannotParseSchema } from '@/domain/core/error/cannot-parse-schema.error';

export enum MODULE_FIELD_TYPE {
  TEXT = 'TEXT',
  NUMBER = 'NUMBER',
  SELECT = 'SELECT',
  MULTISELECT = 'MULTISELECT',
  BOOLEAN = 'BOOLEAN',
  DATE = 'DATE',
  TIME = 'TIME',
  TEXTAREA = 'TEXTAREA',
}

export const ModuleFieldTypeSchema = z.enum(MODULE_FIELD_TYPE);

export const getModuleFieldTypeFromValue = (
  value: string
): MODULE_FIELD_TYPE => {
  const types: MODULE_FIELD_TYPE[] = Object.values(MODULE_FIELD_TYPE);

  const type = types.find((column) => column === value);

  if (!type) {
    throw new ErrorCannotParseSchema(
      'MODULE_FIELD_TYPE',
      `Value "${value}" is not a valid module field type.`
    );
  }

  return type;
};
