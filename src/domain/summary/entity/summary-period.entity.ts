import z from 'zod';

import {
  SummaryTimeBucketItemSchema,
  SummaryTimeBucketSchema,
} from '@/domain/summary/entity/summary-time-bucket.entity';
import { SUMMARY_PERIOD_ENUM } from '@/domain/summary/enum/summary-period.enum';

export const SummaryDayResultSchema = SummaryTimeBucketSchema.extend({
  period: z.literal(SUMMARY_PERIOD_ENUM.DAY),
  buckets: z.array(
    SummaryTimeBucketItemSchema.extend({
      hour: z.number().int().min(0).max(23),
    })
  ),
});

export const SummaryWeekResultSchema = SummaryTimeBucketSchema.extend({
  period: z.literal(SUMMARY_PERIOD_ENUM.WEEK),
  buckets: z.array(
    SummaryTimeBucketItemSchema.extend({
      dayOfWeek: z.number().int().min(0).max(6),
    })
  ),
});

export const SummaryMonthResultSchema = SummaryTimeBucketSchema.extend({
  period: z.literal(SUMMARY_PERIOD_ENUM.MONTH),
  buckets: z.array(
    SummaryTimeBucketItemSchema.extend({
      dayOfMonth: z.number().int().min(1).max(31),
    })
  ),
});

export const SummaryHalfYearResultSchema = SummaryTimeBucketSchema.extend({
  period: z.literal(SUMMARY_PERIOD_ENUM.HALF_YEAR),
  buckets: z.array(
    SummaryTimeBucketItemSchema.extend({
      weekNumber: z.number().int().min(1).max(26),
    })
  ),
});

export const SummaryYearResultSchema = SummaryTimeBucketSchema.extend({
  period: z.literal(SUMMARY_PERIOD_ENUM.YEAR),
  buckets: z.array(
    SummaryTimeBucketItemSchema.extend({
      month: z.number().int().min(1).max(12),
    })
  ),
});

export const SummaryPeriodResultSchema = z.discriminatedUnion('period', [
  SummaryDayResultSchema,
  SummaryWeekResultSchema,
  SummaryMonthResultSchema,
  SummaryHalfYearResultSchema,
  SummaryYearResultSchema,
]);

/**
 * Day period result (24 hourly buckets, 0-23h)
 */
export type TDaySummaryResult = z.infer<typeof SummaryDayResultSchema>;

/**
 * Week period result (7 daily buckets, Mon-Sun)
 */
export type TWeekSummaryResult = z.infer<typeof SummaryWeekResultSchema>;

/**
 * Month period result (30 daily buckets, last 30 days)
 */
export type TMonthSummaryResult = z.infer<typeof SummaryMonthResultSchema>;
/**
 * Half year period result (24 weekly buckets)
 */
export type THalfYearSummaryResult = z.infer<
  typeof SummaryHalfYearResultSchema
>;

/**
 * Year period result (12 monthly buckets, Jan-Dec)
 */
export type TYearSummaryResult = z.infer<typeof SummaryYearResultSchema>;

export type TSummaryPeriodResult = z.infer<typeof SummaryPeriodResultSchema>;
