import z from 'zod';

import { SummaryPinSchema } from '@/domain/summary/entity/summary-pin.entity';

export const RequestGetSummaryPinsSchema = z.void();

export const ResponseGetSummaryPinsSchema = z.object({
  items: z.array(SummaryPinSchema),
});

export type TRequestGetSummaryPins = z.infer<
  typeof RequestGetSummaryPinsSchema
>;

export type TResponseGetSummaryPins = z.infer<
  typeof ResponseGetSummaryPinsSchema
>;
