import { z } from 'zod';

import { ErrorCannotParseSchema } from '@/domain/core/error/cannot-parse-schema.error';

export enum MODULE_KEY_ENUM {
  CIC = 'CIC',
  URINE = 'URINE',
  STOOL = 'STOOL',
  MEDICATION = 'MEDICATION',
  ENEMA = 'ENEMA',
}

export const ModuleKeySchema = z.enum(MODULE_KEY_ENUM);

export const getModuleKeyFromValue = (value: string): MODULE_KEY_ENUM => {
  const types: MODULE_KEY_ENUM[] = Object.values(MODULE_KEY_ENUM);

  const type = types.find((column) => column === value);

  if (typeof type === 'undefined') {
    throw new ErrorCannotParseSchema(
      'MODULE_KEY',
      `Value "${value}" is not a valid module key.`
    );
  }

  return type;
};
