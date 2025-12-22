import z from 'zod';

import { SummaryPinSchema } from '@/domain/summary/entity/summary-pin.entity';

export const RequestReorderSummaryPinsSchema = z.object({
  pins: z.array(SummaryPinSchema),
});

export const ResponseReorderSummaryPinsSchema = z.object({
  pins: z.array(SummaryPinSchema),
});

export type TRequestReorderSummaryPins = z.infer<
  typeof RequestReorderSummaryPinsSchema
>;

export type TResponseReorderSummaryPins = z.infer<
  typeof ResponseReorderSummaryPinsSchema
>;
