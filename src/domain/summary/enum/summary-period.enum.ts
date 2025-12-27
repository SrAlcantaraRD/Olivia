import { z } from 'zod';

export enum SUMMARY_PERIOD_ENUM {
  DAY = 'DAY',
  WEEK = 'WEEK',
  MONTH = 'MONTH',
  HALF_YEAR = 'HALF_YEAR',
  YEAR = 'YEAR',
}

export const SummaryPeriodSchema = z.enum(SUMMARY_PERIOD_ENUM);

export const SUMMARY_PERIOD_I18N_MAP = {
  [SUMMARY_PERIOD_ENUM.DAY]: 'page.summary-detail.period.day',
  [SUMMARY_PERIOD_ENUM.WEEK]: 'page.summary-detail.period.week',
  [SUMMARY_PERIOD_ENUM.MONTH]: 'page.summary-detail.period.month',
  [SUMMARY_PERIOD_ENUM.HALF_YEAR]: 'page.summary-detail.period.half-year',
  [SUMMARY_PERIOD_ENUM.YEAR]: 'page.summary-detail.period.year',
} as const;

export const SUMMARY_PERIOD_VALUES = Object.values(
  SUMMARY_PERIOD_ENUM
) as SUMMARY_PERIOD_ENUM[];
