import { z } from 'zod';

import { ErrorCannotParseSchema } from '@/domain/core/error/cannot-parse-schema.error';

export enum SEX_ENUM {
  MALE = 'M',
  FEMALE = 'F',
}

export const SexSchema = z.enum(SEX_ENUM);

export const getSexTypeFromValue = (value: string): SEX_ENUM => {
  const types: SEX_ENUM[] = Object.values(SEX_ENUM);

  const type = types.find((column) => column === value);

  if (typeof type === 'undefined') {
    throw new ErrorCannotParseSchema(
      'SEX',
      `Value "${value}" is not a valid sex.`
    );
  }

  return type;
};
