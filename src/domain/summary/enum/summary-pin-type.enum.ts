import { z } from 'zod';

import { ErrorCannotParseSchema } from '@/domain/core/error/cannot-parse-schema.error';

export enum SUMMARY_PIN_TYPE_ENUM {
  MODULE = 'module',
  FIELD = 'field',
  TREND = 'trend',
}

export const SummaryPinTypeSchema = z.enum(SUMMARY_PIN_TYPE_ENUM);

export const getSummaryPinTypeFromValue = (
  value: string
): SUMMARY_PIN_TYPE_ENUM => {
  const types: SUMMARY_PIN_TYPE_ENUM[] = Object.values(SUMMARY_PIN_TYPE_ENUM);

  const type = types.find((item) => item === value);

  if (typeof type === 'undefined') {
    throw new ErrorCannotParseSchema(
      'SUMMARY_PIN_TYPE',
      `Value "${value}" is not a valid summary pin type.`
    );
  }

  return type;
};
