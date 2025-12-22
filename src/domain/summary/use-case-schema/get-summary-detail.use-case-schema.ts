import z from 'zod';

import { SummaryDetailSchema } from '@/domain/summary/entity/summary-detail.entity';
import { SummaryDetailTypeSchema } from '@/domain/summary/enum/summary-detail-type.enum';
import { SummaryPeriodSchema } from '@/domain/summary/enum/summary-period.enum';

export const RequestGetSummaryDetailSchema = z.object({
  type: SummaryDetailTypeSchema,
  moduleId: z.number().int().optional(),
  fieldId: z.number().int().optional(),
  trendId: z.string().min(1).optional(),
  period: SummaryPeriodSchema,
});

export const ResponseGetSummaryDetailSchema = SummaryDetailSchema;

export type TRequestGetSummaryDetail = z.infer<
  typeof RequestGetSummaryDetailSchema
>;

export type TResponseGetSummaryDetail = z.infer<
  typeof ResponseGetSummaryDetailSchema
>;
