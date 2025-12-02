import { z } from 'zod';

import { ErrorCannotParseSchema } from '@/domain/core/error/cannot-parse-schema.error';

export enum SEX {
  MALE = 'M',
  FEMALE = 'F',
}

export const SexSchema = z.enum(SEX);

export const getSexTypeFromValue = (value: string): SEX => {
  const types: SEX[] = Object.values(SEX);

  const type = types.find((column) => column === value);

  if (!type) {
    throw new ErrorCannotParseSchema(
      'SEX',
      `Value "${value}" is not a valid sex.`
    );
  }

  return type;
};
