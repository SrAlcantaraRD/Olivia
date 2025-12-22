import z from 'zod';

import { CarerEntitySchema } from '@/domain/carer/entity/carer.entity';
import { GenerateQRDTOSchema } from '@/domain/core/dto/qr.dto';

export const InviteSecondaryCarerQRPayloadSchema = CarerEntitySchema.pick({
  id: true,
  name: true,
}).extend({
  expiresAt: z.date(),
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
