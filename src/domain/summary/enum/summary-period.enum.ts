import { z } from 'zod';

import type { Ti18nKeys } from '@/ui/i18n/locales/en-EN';

export enum SUMMARY_PERIOD_ENUM {
  DAY = 'DAY',
  WEEK = 'WEEK',
  MONTH = 'MONTH',
  HALF_YEAR = 'HALF_YEAR',
  YEAR = 'YEAR',
}

export enum SUMMARY_PERIOD_DAYS_ENUM {
  SUNDAY = 'sunday',
  MONDAY = 'monday',
  TUESDAY = 'tuesday',
  WEDNESDAY = 'wednesday',
  THURSDAY = 'thursday',
  FRIDAY = 'friday',
  SATURDAY = 'saturday',
}

export const SummaryPeriodSchema = z.enum(SUMMARY_PERIOD_ENUM);

export const SUMMARY_PERIOD_I18N_MAP: Record<SUMMARY_PERIOD_ENUM, Ti18nKeys> =
  Object.freeze({
    [SUMMARY_PERIOD_ENUM.DAY]: 'page.summary-detail.period.day',
    [SUMMARY_PERIOD_ENUM.WEEK]: 'page.summary-detail.period.week',
    [SUMMARY_PERIOD_ENUM.MONTH]: 'page.summary-detail.period.month',
    [SUMMARY_PERIOD_ENUM.HALF_YEAR]: 'page.summary-detail.period.half-year',
    [SUMMARY_PERIOD_ENUM.YEAR]: 'page.summary-detail.period.year',
  } as const);

export const SUMMARY_PERIOD_DAYS_MAP: Record<
  SUMMARY_PERIOD_DAYS_ENUM,
  Ti18nKeys
> = Object.freeze({
  [SUMMARY_PERIOD_DAYS_ENUM.SUNDAY]: 'common.days.sunday',
  [SUMMARY_PERIOD_DAYS_ENUM.MONDAY]: 'common.days.monday',
  [SUMMARY_PERIOD_DAYS_ENUM.TUESDAY]: 'common.days.tuesday',
  [SUMMARY_PERIOD_DAYS_ENUM.WEDNESDAY]: 'common.days.wednesday',
  [SUMMARY_PERIOD_DAYS_ENUM.THURSDAY]: 'common.days.thursday',
  [SUMMARY_PERIOD_DAYS_ENUM.FRIDAY]: 'common.days.friday',
  [SUMMARY_PERIOD_DAYS_ENUM.SATURDAY]: 'common.days.saturday',
} as const);

export const SUMMARY_PERIOD_VALUES = Object.values(
  SUMMARY_PERIOD_ENUM
) as SUMMARY_PERIOD_ENUM[];
