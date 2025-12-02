import { z } from 'zod';

import { ErrorCannotParseSchema } from '@/domain/core/error/cannot-parse-schema.error';

export enum AUTONOMY_LEVEL {
  NONE = 'NONE',
  VERY_LOW = 'VERY_LOW',
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  FULL = 'FULL',
}

export const AutonomyLevelSchema = z.enum(AUTONOMY_LEVEL);

export const getAutonomyLevelFromValue = (value: string): AUTONOMY_LEVEL => {
  const types: AUTONOMY_LEVEL[] = Object.values(AUTONOMY_LEVEL);

  const type = types.find((column) => column === value);

  if (!type) {
    throw new ErrorCannotParseSchema(
      'AUTONOMY_LEVEL',
      `Value "${value}" is not a valid autonomy level.`
    );
  }

  return type;
};
