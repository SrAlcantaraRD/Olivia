import z from 'zod';

import { QR_KEY } from '@/domain/core/enum/qr-key.enum';
import { QRBundlerVersionSchema } from '@/domain/core/enum/qr.enum';

export const QRMetadataSchema = z.object({
  [QR_KEY.VERSION]: QRBundlerVersionSchema,
});

export const GenerateQRDTOSchema = <T extends z.ZodTypeAny>(
  payloadSchema: T
) => {
  return z.object({
    [QR_KEY.METADATA]: QRMetadataSchema,
    [QR_KEY.PAYLOAD]: payloadSchema,
  });
};

export const QRBundleSchema = z.string(); // Base64 encoded string representing the entire QR bundle

export const QRChunkSchema = z.object({
  [QR_KEY.BUNDLE_ID]: z.string(),
  [QR_KEY.CHUNK_INDEX]: z.number().int().min(1),
  [QR_KEY.CHUNK_TOTAL]: z.number().int().min(1),
  [QR_KEY.CHUNK_DATA]: z.string(),
});

export type TQRMetadata = z.infer<typeof QRMetadataSchema>;
export type TQRBundle = z.infer<typeof QRBundleSchema>;
export type TQR<T> = {
  [QR_KEY.METADATA]: TQRMetadata;
  [QR_KEY.PAYLOAD]: T;
};

export type TQRChunk = z.infer<typeof QRChunkSchema>;
