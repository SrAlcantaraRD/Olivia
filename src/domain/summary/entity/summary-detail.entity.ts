import { z } from 'zod';

import { ModuleFieldTypeSchema } from '@/domain/module/enum/module-field-type.enum';
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
  fieldSummaries: z
    .array(
      z.object({
        id: z.number(),
        code: z.string(),
        type: ModuleFieldTypeSchema,
        param: z.string().optional(), // For SELECT, the values
        series: z.union([
          z.array(z.number()), // For trend (TEXT/Numbers)
          z.array(z.object({ label: z.string(), count: z.number() })), // For distribution (SELECT)
        ]),
        average: z.number().nullable(),
        todayValue: z.number(),
      })
    )
    .optional(),
});

export type TSummaryDetail = z.infer<typeof SummaryDetailSchema>;
