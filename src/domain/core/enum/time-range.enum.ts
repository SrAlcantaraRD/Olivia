/**
 * Time range options for analytics and reports.
 * Used to define date ranges for filtering historical data.
 */
export enum TIME_RANGE_ENUM {
  TODAY = 'today',
  WEEK_7D = '7d',
  MONTH_30D = '30d',
  QUARTER_90D = '90d',
}

/**
 * Maps time range enum values to their corresponding i18n keys.
 * Used for UI rendering of time range labels.
 * Keys are literal types to ensure TypeScript compatibility with Ti18nKeys.
 */
export const TIME_RANGE_I18N_MAP = {
  [TIME_RANGE_ENUM.TODAY]: 'page.history-detail.range.today',
  [TIME_RANGE_ENUM.WEEK_7D]: 'page.history-detail.range.7d',
  [TIME_RANGE_ENUM.MONTH_30D]: 'page.history-detail.range.30d',
  [TIME_RANGE_ENUM.QUARTER_90D]: 'page.history-detail.range.90d',
} as const;

/** * Ordered array of all available time ranges for UI iteration.
 */
export const TIME_RANGE_VALUES = Object.values(
  TIME_RANGE_ENUM
) as TIME_RANGE_ENUM[];
