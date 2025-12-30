import z from 'zod';

import { SummaryModuleSchema } from '@/domain/summary/entity/summary-module.entity';

export const RequestGetSummaryModuleByPeriodSchema = z.object({
  moduleIds: z.array(z.number().int()),
});

export const ResponseGetSummaryModuleByPeriod = z.array(SummaryModuleSchema);

export type TRequestGetSummaryModuleByPeriods = z.infer<
  typeof RequestGetSummaryModuleByPeriodSchema
>;

export type TResponseGetSummaryModuleByPeriod = z.infer<
  typeof ResponseGetSummaryModuleByPeriod
>;
