import z from 'zod';

export const SummaryStatisticsSchema = z.object({
  currentPeriodTotal: z.number().nonnegative(),
  previousPeriodTotal: z.number().nonnegative(),
  percentageChange: z.number().nullable(),
  lastRecordedAt: z.date().nullable(),
  previousPeriodAverage: z.number().nullable(),
  currentPeriodAverage: z.number().nullable(),
  mostCommonValue: z.string().nullable(),
  weightedAverage: z.number().nullable(),
});

export type TSummaryStatistics = z.infer<typeof SummaryStatisticsSchema>;

export const BASE_SUMMARY_STATISTICS = {
  currentPeriodTotal: 0,
  previousPeriodTotal: 0,
  percentageChange: 0,
  lastRecordedAt: new Date(0),
  previousPeriodAverage: null,
  currentPeriodAverage: null,
  mostCommonValue: null,
  weightedAverage: null,
} satisfies TSummaryStatistics;
