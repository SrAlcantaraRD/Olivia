import z from 'zod';

import { QRBunderVersionSchema } from '@/domain/core/enum/qr.enum';

export const QRMetadataSchema = z.object({
  version: QRBunderVersionSchema,
  nonce: z.string(),
});

export const GenerateQRDTOSchema = <T extends z.ZodTypeAny>(
  payloadSchema: T
) => {
  return z.object({
    metadata: QRMetadataSchema,
    payload: payloadSchema,
  });
};

export const QRBundleSchema = z.string(); // Base64 encoded string representing the entire QR bundle

export const QRDTOChunkSchema = z.object({
  bundleID: z.string(),
  chunkIndex: z.number().min(1),
  chunkTotal: z.number().min(1),
  data: QRBundleSchema,
});

export const QRDTOChunkListSchema = z.array(QRDTOChunkSchema);

export type TQRMetadata = z.infer<typeof QRMetadataSchema>;
export type TQRBundle = z.infer<typeof QRBundleSchema>;
export type TQR<T> = {
  metadata: TQRMetadata;
  payload: T;
};
export type TQRChunk = z.infer<typeof QRDTOChunkSchema>;
