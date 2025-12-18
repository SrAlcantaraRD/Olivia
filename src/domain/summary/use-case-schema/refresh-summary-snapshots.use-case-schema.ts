import z from 'zod';

import { SummarySnapshotSchema } from '@/domain/summary/entity/summary-snapshot.entity';

export const RequestRefreshSummarySnapshotsSchema = z.object({
  moduleIds: z.array(z.number().int()),
});

export const ResponseRefreshSummarySnapshotsSchema = SummarySnapshotSchema;

export type TRequestRefreshSummarySnapshots = z.infer<
  typeof RequestRefreshSummarySnapshotsSchema
>;

export type TResponseRefreshSummarySnapshots = z.infer<
  typeof ResponseRefreshSummarySnapshotsSchema
>;
