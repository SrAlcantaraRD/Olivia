import z from 'zod';

export enum QR_BUNDLE_VERSION {
  V1 = '1',
}

export const QRBunderVersionSchema = z.enum(QR_BUNDLE_VERSION);
