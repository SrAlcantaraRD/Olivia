import z from 'zod';

import { GenerateQRDTOSchema } from '@/domain/core/dto/qr.dto';
import { QR_KEY } from '@/domain/core/enum/qr-key.enum';
import { IDSchema } from '@/domain/core/schemas/id.schema';

export const InviteSecondaryCarerQRPayloadSchema = z.object({
  [QR_KEY.ORIGIN_CARER_ID]: IDSchema,
  [QR_KEY.ORIGIN_CARER_NAME]: z.string(),
  [QR_KEY.ORIGIN_CARER_EXPIRES_AT]: z.date(),
  [QR_KEY.ORIGIN_CARER_ACTIVE_MODULE_ID_LIST]: z.array(IDSchema),
});

export const InviteSecondaryCarerQRSchema = GenerateQRDTOSchema(
  InviteSecondaryCarerQRPayloadSchema
);

export type TInviteSecondaryCarerQRPayload = z.infer<
  typeof InviteSecondaryCarerQRPayloadSchema
>;

export type TInviteSecondaryCarerQR = z.infer<
  typeof InviteSecondaryCarerQRSchema
>;
