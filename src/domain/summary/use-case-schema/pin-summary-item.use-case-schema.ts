import z from 'zod';

import { SummaryPinSchema } from '@/domain/summary/entity/summary-pin.entity';
import { SummaryPinTypeSchema } from '@/domain/summary/enum/summary-pin-type.enum';

export const RequestPinSummaryItemSchema = z.object({
  type: SummaryPinTypeSchema,
  targetId: z.string().min(1),
});

export const ResponsePinSummaryItemSchema = z.object({
  pins: z.array(SummaryPinSchema),
});

export type TRequestPinSummaryItem = z.infer<
  typeof RequestPinSummaryItemSchema
>;

export type TResponsePinSummaryItem = z.infer<
  typeof ResponsePinSummaryItemSchema
>;
