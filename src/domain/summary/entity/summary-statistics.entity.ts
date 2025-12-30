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
