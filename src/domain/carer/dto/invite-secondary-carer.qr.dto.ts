import z from 'zod';

import { GenerateQRDTOSchema } from '@/domain/core/dto/qr.dto';
import { QR_KEY } from '@/domain/core/enum/qr-key.enum';
import { IDSchema } from '@/domain/core/schemas/id.schema';

const ActiveModuleSchema = z.object({
  [QR_KEY.MODULE_ID]: IDSchema,
  [QR_KEY.MODULE_FIELD_LIST]: z.array(IDSchema),
});

export const InviteSecondaryCarerQRPayloadSchema = z.object({
  [QR_KEY.ORIGIN_CARER_ID]: IDSchema,
  [QR_KEY.ORIGIN_CARER_NAME]: z.string(),
  [QR_KEY.ORIGIN_CARER_EXPIRES_AT]: z.date(),
  [QR_KEY.MODULE_LIST]: z.array(ActiveModuleSchema),
});

export const InviteSecondaryCarerQRSchema = GenerateQRDTOSchema(
  InviteSecondaryCarerQRPayloadSchema
);

export type TInviteSecondaryCarerQRPayload = z.infer<
  typeof InviteSecondaryCarerQRPayloadSchema
>;

export type TInviteSecondaryCarerQRActiveModule = z.infer<
  typeof ActiveModuleSchema
>;

export type TInviteSecondaryCarerQR = z.infer<
  typeof InviteSecondaryCarerQRSchema
>;
