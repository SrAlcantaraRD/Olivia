import { z } from 'zod';

import { ErrorCannotParseSchema } from '@/domain/core/error/cannot-parse-schema.error';

export enum SUMMARY_PERIOD_ENUM {
  DAY = 'DAY',
  WEEK = 'WEEK',
  MONTH = 'MONTH',
  HALF_YEAR = 'HALF_YEAR',
  YEAR = 'YEAR',
}

export const SummaryPeriodSchema = z.enum(SUMMARY_PERIOD_ENUM);

export const getSummaryPeriodFromValue = (
  value: string
): SUMMARY_PERIOD_ENUM => {
  const types: SUMMARY_PERIOD_ENUM[] = Object.values(SUMMARY_PERIOD_ENUM);

  const type = types.find((item) => item === value);

  if (typeof type === 'undefined') {
    throw new ErrorCannotParseSchema(
      'SUMMARY_PERIOD',
      `Value "${value}" is not a valid summary period.`
    );
  }

  return type;
};
