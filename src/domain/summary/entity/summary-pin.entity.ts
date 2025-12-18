import { z } from 'zod';

import { SummaryPinTypeSchema } from '@/domain/summary/enum/summary-pin-type.enum';

export const SummaryPinSchema = z.object({
  type: SummaryPinTypeSchema,
  targetId: z.string().min(1),
  pinnedAt: z.string().min(1),
  order: z.number().int().nonnegative(),
});

export type TSummaryPin = z.infer<typeof SummaryPinSchema>;
