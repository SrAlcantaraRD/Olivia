import { z } from 'zod';

import { SummaryHighlightSchema } from '@/domain/summary/entity/summary-highlight.entity';
import { SummaryModuleSchema } from '@/domain/summary/entity/summary-module.entity';
import { SummaryTrendSchema } from '@/domain/summary/entity/summary-trend.entity';

export const SummarySnapshotSchema = z.object({
  modules: z.array(SummaryModuleSchema),
  trends: z.array(SummaryTrendSchema),
  highlights: z.array(SummaryHighlightSchema),
  updatedAt: z.string().min(1),
});

export type TSummarySnapshot = z.infer<typeof SummarySnapshotSchema>;
