import { z } from 'zod';

import { QRChunkSchema } from '@/domain/core/dto/qr.dto';

export const RequestConsumeRecordSynchronizationQRSchema = z.object({
  chunkList: z.array(QRChunkSchema).min(1),
});

export const ResponseConsumeRecordSynchronizationQRSchema = z.object({
  applied: z.boolean(),
  appliedCount: z.number().int().nonnegative(),
});

export type TRequestConsumeRecordSynchronizationQR = z.infer<
  typeof RequestConsumeRecordSynchronizationQRSchema
>;

export type TResponseConsumeRecordSynchronizationQR = z.infer<
  typeof ResponseConsumeRecordSynchronizationQRSchema
>;
