import { z } from 'zod';

export const SummarySeriesPointSchema = z.object({
  date: z.string().min(1),
  value: z.number(),
});

export type TSummarySeriesPoint = z.infer<typeof SummarySeriesPointSchema>;
