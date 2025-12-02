import z from 'zod';

import { ErrorCannotParseSchema } from '@/domain/core/error/cannot-parse-schema.error';

export enum CARER_TYPE {
  ADMIN = 'ADMIN',
  SECONDARY = 'SECUNDARIO',
  HEALTH = 'SANITARIO',
}

export const getCarerTypeFromValue = (value: string): CARER_TYPE => {
  const types: CARER_TYPE[] = Object.values(CARER_TYPE);

  const type = types.find((column) => column === value);

  if (!type) {
    throw new ErrorCannotParseSchema(
      'CARER_TYPE',
      `Value "${value}" is not a valid carer type.`
    );
  }

  return type;
};

export const CarerTypeSchema = z.enum(CARER_TYPE);
