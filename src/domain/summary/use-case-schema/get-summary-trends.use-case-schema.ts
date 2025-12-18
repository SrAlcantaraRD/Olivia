import z from 'zod';

import { SummaryTrendSchema } from '@/domain/summary/entity/summary-trend.entity';

export const RequestGetSummaryTrendsSchema = z.void();

export const ResponseGetSummaryTrendsSchema = z.object({
  items: z.array(SummaryTrendSchema),
});

export type TRequestGetSummaryTrends = z.infer<
  typeof RequestGetSummaryTrendsSchema
>;

export type TResponseGetSummaryTrends = z.infer<
  typeof ResponseGetSummaryTrendsSchema
>;
