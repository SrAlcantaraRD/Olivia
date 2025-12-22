import z from 'zod';

import { SummaryModuleSchema } from '@/domain/summary/entity/summary-module.entity';

export const RequestGetSummaryModulesSchema = z.object({
  moduleIds: z.array(z.number().int()),
});

export const ResponseGetSummaryModulesSchema = z.object({
  items: z.array(SummaryModuleSchema),
});

export type TRequestGetSummaryModules = z.infer<
  typeof RequestGetSummaryModulesSchema
>;

export type TResponseGetSummaryModules = z.infer<
  typeof ResponseGetSummaryModulesSchema
>;
