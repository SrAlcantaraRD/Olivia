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

/**
 * Maps summary period enum values to their corresponding i18n keys.
 * Used for UI rendering of period selector labels.
 * Keys are literal types to ensure TypeScript compatibility with Ti18nKeys.
 */
export const SUMMARY_PERIOD_I18N_MAP = {
  [SUMMARY_PERIOD_ENUM.DAY]: 'page.summary-detail.period.day',
  [SUMMARY_PERIOD_ENUM.WEEK]: 'page.summary-detail.period.week',
  [SUMMARY_PERIOD_ENUM.MONTH]: 'page.summary-detail.period.month',
  [SUMMARY_PERIOD_ENUM.HALF_YEAR]: 'page.summary-detail.period.half-year',
  [SUMMARY_PERIOD_ENUM.YEAR]: 'page.summary-detail.period.year',
} as const;

/**
 * Ordered array of all available summary periods for UI iteration.
 */
export const SUMMARY_PERIOD_VALUES = Object.values(
  SUMMARY_PERIOD_ENUM
) as SUMMARY_PERIOD_ENUM[];
