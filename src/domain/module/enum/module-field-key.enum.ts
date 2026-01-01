import { z } from 'zod';

import { ErrorCannotParseSchema } from '@/domain/core/error/cannot-parse-schema.error';

export enum MODULE_FIELD_KEY_ENUM {
  VOLUMEN_LEVEL = 'volumen-level',
  COLOR = 'color',
  TURBIDITY = 'turbidity',
  DISCOMFORT_LEVEL = 'discomfort-level',
}

export const ModuleFieldKeySchema = z.enum(MODULE_FIELD_KEY_ENUM);

export const getModuleFieldKeyFromValue = (
  value: string
): MODULE_FIELD_KEY_ENUM => {
  const types: MODULE_FIELD_KEY_ENUM[] = Object.values(MODULE_FIELD_KEY_ENUM);

  const type = types.find((column) => column === value);

  if (typeof type === 'undefined') {
    throw new ErrorCannotParseSchema(
      'MODULE_FIELD_KEY',
      `Value "${value}" is not a valid module field key.`
    );
  }

  return type;
};
