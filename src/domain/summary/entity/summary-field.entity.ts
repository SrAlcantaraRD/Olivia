import { z } from 'zod';

import { IDSchema } from '@/domain/core/schemas/id.schema';
import { SummarySeriesPointSchema } from '@/domain/summary/entity/summary-series-point.entity';

export const SummaryFieldSchema = z.object({
  moduleId: IDSchema,
  fieldId: IDSchema,
  fieldKey: z.string().min(1),
  todayCount: z.number().nonnegative(),
  lastRecordedAt: z.string().nullable(),
  last7Days: z.array(SummarySeriesPointSchema),
  previousPeriodAverage: z.number().nullable(),
});

export type TSummaryField = z.infer<typeof SummaryFieldSchema>;
