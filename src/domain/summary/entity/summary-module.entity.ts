import { z } from 'zod';

import { STATUS_ENUM } from '@/domain/core/enum/status.enum';
import { ModuleFieldSchema } from '@/domain/module/entity/module-field.entity';
import { ModuleSchema } from '@/domain/module/entity/module.entity';
import { MODULE_KEY_ENUM } from '@/domain/module/enum/module-key.enum';
import { SummaryModuleFieldSchema } from '@/domain/summary/entity/summary-field.entity';
import {
  SUMMARY_PERIOD_VALUES,
  SummaryPeriodResultSchema,
} from '@/domain/summary/entity/summary-period.entity';
import {
  BASE_SUMMARY_STATISTICS,
  SummaryStatisticsSchema,
} from '@/domain/summary/entity/summary-statistics.entity';

export const SummaryModuleSchema = z.object({
  get summaryModuleFieldList() {
    return z.array(SummaryModuleFieldSchema);
  },

  metadata: z.object({
    module: ModuleSchema,
    moduleFieldList: z.array(ModuleFieldSchema),
  }),
  groupedData: SummaryPeriodResultSchema,
  statistics: SummaryStatisticsSchema,
});

export type TSummaryModule = z.infer<typeof SummaryModuleSchema>;

export const BASE_SUMMARY_MODULE = {
  summaryModuleFieldList: [],
  metadata: {
    module: {
      id: -1,
      code: MODULE_KEY_ENUM.CIC,
      createdAt: new Date(),
      description: '',
      isActive: false,
      name: '',
      status: STATUS_ENUM.INACTIVE,
    },
    moduleFieldList: [],
  },
  groupedData: SUMMARY_PERIOD_VALUES,
  statistics: BASE_SUMMARY_STATISTICS,
} satisfies TSummaryModule;
