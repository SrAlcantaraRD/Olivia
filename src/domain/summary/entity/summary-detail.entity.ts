import { z } from 'zod';

import { SummarySeriesPointSchema } from '@/domain/summary/entity/summary-series-point.entity';
import { SummaryDetailTypeSchema } from '@/domain/summary/enum/summary-detail-type.enum';

export const SummaryDetailSchema = z.object({
  type: SummaryDetailTypeSchema,
  targetId: z.string().min(1),
  titleKey: z.string().min(1),
  descriptionKey: z.string().min(1),
  analysisText: z.string().nullable(),
  series: z.array(SummarySeriesPointSchema),
  average: z.number().nullable(),
  todayValue: z.number().nullable(),
  comparisonTextKey: z.string().nullable(),
  projectionTextKey: z.string().nullable(),
});

export type TSummaryDetail = z.infer<typeof SummaryDetailSchema>;
