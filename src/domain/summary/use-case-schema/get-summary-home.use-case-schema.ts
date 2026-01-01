import z from 'zod';

import { SummaryModuleSchema } from '@/domain/summary/entity/summary-module.entity';

export const RequestGetSummaryHomeSchema = z.object({
  moduleIds: z.array(z.number().int()),
});

export const ResponseGetSummaryHomeSchema = z.object({
  modules: z.array(SummaryModuleSchema),
});

export type TRequestGetSummaryHome = z.infer<
  typeof RequestGetSummaryHomeSchema
>;

export type TResponseGetSummaryHome = z.infer<
  typeof ResponseGetSummaryHomeSchema
>;
