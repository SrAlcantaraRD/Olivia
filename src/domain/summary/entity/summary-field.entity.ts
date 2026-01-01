import { z } from 'zod';

import { IDSchema } from '@/domain/core/schemas/id.schema';
import { ModuleFieldSchema } from '@/domain/module/entity/module-field.entity';
import { SummaryPeriodResultSchema } from '@/domain/summary/entity/summary-period.entity';
import { SummaryStatisticsSchema } from '@/domain/summary/entity/summary-statistics.entity';

export const SummaryFieldDistributionSchema = z.object({
  value: z.string(),
  count: z.number().nonnegative(),
  percentage: z.number().min(0).max(100),
});

export const SummaryModuleFieldSchema = z.object({
  metadata: z.object({
    moduleID: IDSchema,
    moduleField: ModuleFieldSchema,
  }),
  groupedData: SummaryPeriodResultSchema,
  distribution: z.array(SummaryFieldDistributionSchema),
  statistics: SummaryStatisticsSchema,
});

export type TSummaryModuleField = z.infer<typeof SummaryModuleFieldSchema>;

export type TSummaryModuleFieldDistribution = z.infer<
  typeof SummaryFieldDistributionSchema
>;
