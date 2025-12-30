import z from 'zod';

import { SummaryModuleSchema } from '@/domain/summary/entity/summary-module.entity';
import { SummaryPeriodSchema } from '@/domain/summary/enum/summary-period.enum';

export const RequestGetSummaryModuleListByPeriodSchema = z.object({
  period: SummaryPeriodSchema,
});

export const ResponseGetSummaryModuleListByPeriod =
  z.array(SummaryModuleSchema);

export type TRequestGetSummaryModuleListByPeriod = z.infer<
  typeof RequestGetSummaryModuleListByPeriodSchema
>;

export type TResponseGetSummaryModuleListByPeriod = z.infer<
  typeof ResponseGetSummaryModuleListByPeriod
>;
