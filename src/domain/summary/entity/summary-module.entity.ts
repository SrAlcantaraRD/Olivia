import { z } from 'zod';

import { ModuleSchema } from '@/domain/module/entity/module.entity';
import { SummaryPeriodResultSchema } from '@/domain/summary/entity/summary-period.entity';
import { SummaryStatisticsSchema } from '@/domain/summary/entity/summary-statistics.entity';

export const SummaryModuleSchema = z.object({
  module: ModuleSchema,
  groupedData: SummaryPeriodResultSchema,
  statistics: SummaryStatisticsSchema,
});

export type TSummaryModule = z.infer<typeof SummaryModuleSchema>;
