import z from 'zod';

export enum QR_BUNDLER_VERSION {
  V1 = '1',
}

export const QRBundlerVersionSchema = z.enum(QR_BUNDLER_VERSION);
