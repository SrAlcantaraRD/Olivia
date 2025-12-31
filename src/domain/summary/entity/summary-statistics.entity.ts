import z from 'zod';

export const SummaryStatisticsSchema = z.object({
  currentPeriodTotal: z.number().nonnegative(),
  previousPeriodTotal: z.number().nonnegative(),
  percentageChange: z.number(),
  lastRecordedAt: z.date(),
  previousPeriodAverage: z.number().nullable(),
  currentPeriodAverage: z.number().nullable(),
});

export type TSummaryStatistics = z.infer<typeof SummaryStatisticsSchema>;

export const BASE_SUMMARY_STATISTICS = {
  currentPeriodTotal: 0,
  previousPeriodTotal: 0,
  percentageChange: 0,
  lastRecordedAt: new Date(0),
  previousPeriodAverage: null,
  currentPeriodAverage: null,
} satisfies TSummaryStatistics;
