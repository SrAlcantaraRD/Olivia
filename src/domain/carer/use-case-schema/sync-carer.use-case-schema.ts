import { z } from 'zod';

import { IDSchema } from '@/domain/core/schemas/id.schema';

export const RequestSyncWithCarerSchema = z.object({
  carerID: IDSchema,
  recordsImported: z.number().int().nonnegative(),
  status: z.enum(['success', 'failure']),
  details: z.string().optional(),
  timestamp: z.string().optional(),
});

export const ResponseSyncWithCarerSchema = z.void();

export type TResponseSyncWithCarer = z.infer<
  typeof ResponseSyncWithCarerSchema
>;
export type TRequestSyncWithCarer = z.infer<typeof RequestSyncWithCarerSchema>;
