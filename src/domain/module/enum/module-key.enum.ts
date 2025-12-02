import { z } from 'zod';

import { ErrorCannotParseSchema } from '@/domain/core/error/cannot-parse-schema.error';

export enum MODULE_KEY {
  CIC = 'CIC',
  URINE = 'URINE',
  STOOL = 'STOOL',
  MEDICATION = 'MEDICATION',
  ENEMA = 'ENEMA',
}

export const ModuleKeySchema = z.enum(MODULE_KEY);

export const getModuleKeyFromValue = (value: string): MODULE_KEY => {
  const types: MODULE_KEY[] = Object.values(MODULE_KEY);

  const type = types.find((column) => column === value);

  if (!type) {
    throw new ErrorCannotParseSchema(
      'MODULE_KEY',
      `Value "${value}" is not a valid module key.`
    );
  }

  return type;
};
