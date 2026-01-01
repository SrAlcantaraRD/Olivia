import { z } from 'zod';

import { QRChunkSchema } from '@/domain/core/dto/qr.dto';
import { RecordSyncBundleSchema } from '@/domain/core/dto/sync-record.dto';
import { IDSchema } from '@/domain/core/schemas/id.schema';

export const RequestGenerateRecordSynchronizationQRSchema = z.object({
  carerID: IDSchema,
});

export const ResponseGenerateRecordSynchronizationQRSchema = z.object({
  bundle: RecordSyncBundleSchema,
  chunkList: z.array(QRChunkSchema).min(1),
});

export type TRequestGenerateRecordSynchronizationQR = z.infer<
  typeof RequestGenerateRecordSynchronizationQRSchema
>;

export type TResponseGenerateRecordSynchronizationQR = z.infer<
  typeof ResponseGenerateRecordSynchronizationQRSchema
>;
