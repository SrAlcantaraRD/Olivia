import z from 'zod';

import { SummaryPeriodSchema } from '@/domain/summary/enum/summary-period.enum';

export const SummaryTimeBucketItemSchema = z.object({
  label: z.string(),
  value: z.number().nonnegative(),
  timestamp: z.date(),
});

export const SummaryTimeBucketMetadataSchema = z.object({
  totalCount: z.number().nonnegative(),
  uniqueRecords: z.number().nonnegative(),
  dateRange: z.object({
    from: z.date(),
    to: z.date(),
  }),
});

export const SummaryTimeBucketSchema = z.object({
  period: SummaryPeriodSchema,
  buckets: z.array(SummaryTimeBucketItemSchema),
  metadata: SummaryTimeBucketMetadataSchema,
});

/**
 * Represents a time bucket in a grouped summary
 */
export type TTimeBucketItem = z.infer<typeof SummaryTimeBucketItemSchema>;

export type TSummaryTimeBucketMetadata = z.infer<
  typeof SummaryTimeBucketMetadataSchema
>;
/**
 * Base structure for grouped RecordFields by period
 */
export type TSummaryTimeBucket = z.infer<typeof SummaryTimeBucketSchema>;
