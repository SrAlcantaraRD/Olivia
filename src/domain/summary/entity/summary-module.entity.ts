import { z } from 'zod';

import { IDSchema } from '@/domain/core/schemas/id.schema';
import { ModuleKeySchema } from '@/domain/module/enum/module-key.enum';
import { SummarySeriesPointSchema } from '@/domain/summary/entity/summary-series-point.entity';

export const SummaryModuleSchema = z.object({
  moduleId: IDSchema,
  moduleKey: ModuleKeySchema,
  todayCount: z.number().nonnegative(),
  lastRecordedAt: z.string().nullable(),
  last7Days: z.array(SummarySeriesPointSchema),
  previousPeriodAverage: z.number().nullable(),
});

export type TSummaryModule = z.infer<typeof SummaryModuleSchema>;
