import z from 'zod';

import { SummaryModuleSchema } from '@/domain/summary/entity/summary-module.entity';
import { SummaryPinSchema } from '@/domain/summary/entity/summary-pin.entity';

export const RequestGetSummaryHomeSchema = z.object({
  moduleIds: z.array(z.number().int()),
});

export const ResponseGetSummaryHomeSchema = z.object({
  modules: z.array(SummaryModuleSchema),
  pins: z.array(SummaryPinSchema),
});

export type TRequestGetSummaryHome = z.infer<
  typeof RequestGetSummaryHomeSchema
>;

export type TResponseGetSummaryHome = z.infer<
  typeof ResponseGetSummaryHomeSchema
>;
