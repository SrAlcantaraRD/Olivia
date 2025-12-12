import z from 'zod';

import { ErrorCannotParseSchema } from '@/domain/core/error/cannot-parse-schema.error';

export enum STATUS_ENUM {
  ACTIVE = 1,
  INACTIVE = 0,
}

export const statusSchema = z.enum(STATUS_ENUM);

export const getStatusFromValue = (value: number): STATUS_ENUM => {
  const types: STATUS_ENUM[] = Object.values(STATUS_ENUM).filter(
    (data) => typeof data === 'number'
  );

  const type = types.find((column) => column === value);

  if (!type) {
    throw new ErrorCannotParseSchema(
      'STATUS_ENUM',
      `Value "${value}" is not a valid STATUS_ENUM.`
    );
  }

  return type;
};
