import z from 'zod';

import { SummaryPinSchema } from '@/domain/summary/entity/summary-pin.entity';
import { SummaryPinTypeSchema } from '@/domain/summary/enum/summary-pin-type.enum';

export const RequestUnpinSummaryItemSchema = z.object({
  type: SummaryPinTypeSchema,
  targetId: z.string().min(1),
});

export const ResponseUnpinSummaryItemSchema = z.object({
  pins: z.array(SummaryPinSchema),
});

export type TRequestUnpinSummaryItem = z.infer<
  typeof RequestUnpinSummaryItemSchema
>;

export type TResponseUnpinSummaryItem = z.infer<
  typeof ResponseUnpinSummaryItemSchema
>;
