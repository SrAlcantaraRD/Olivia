import z from 'zod';

import { SummaryHighlightSchema } from '@/domain/summary/entity/summary-highlight.entity';

export const RequestGetSummaryHighlightsSchema = z.void();

export const ResponseGetSummaryHighlightsSchema = z.object({
  items: z.array(SummaryHighlightSchema),
});

export type TRequestGetSummaryHighlights = z.infer<
  typeof RequestGetSummaryHighlightsSchema
>;

export type TResponseGetSummaryHighlights = z.infer<
  typeof ResponseGetSummaryHighlightsSchema
>;
