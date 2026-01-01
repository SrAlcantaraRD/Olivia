import z from 'zod';

import { IDSchema } from '@/domain/core/schemas/id.schema';
import { SummaryModuleSchema } from '@/domain/summary/entity/summary-module.entity';
import { SummaryPeriodSchema } from '@/domain/summary/enum/summary-period.enum';

export const RequestGetSummaryModuleDetailByPeriodSchema = z.object({
  moduleID: IDSchema,
  period: SummaryPeriodSchema,
});

export const ResponseGetSummaryModuleDetailByPeriod = SummaryModuleSchema;

export type TRequestGetSummaryModuleDetailByPeriod = z.infer<
  typeof RequestGetSummaryModuleDetailByPeriodSchema
>;

export type TResponseGetSummaryModuleDetailByPeriod = z.infer<
  typeof ResponseGetSummaryModuleDetailByPeriod
>;
