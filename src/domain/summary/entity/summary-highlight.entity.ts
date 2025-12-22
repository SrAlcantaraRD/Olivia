import { z } from 'zod';

import { IDSchema } from '@/domain/core/schemas/id.schema';

export const SummaryHighlightSchema = z.object({
  id: z.string().min(1),
  titleKey: z.string().min(1),
  descriptionKey: z.string().min(1),
  moduleId: IDSchema.optional(),
  fieldId: IDSchema.optional(),
});

export type TSummaryHighlight = z.infer<typeof SummaryHighlightSchema>;
