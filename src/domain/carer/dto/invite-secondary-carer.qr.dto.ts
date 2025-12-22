import z from 'zod';

import { CarerEntitySchema } from '@/domain/carer/entity/carer.entity';
import { CARER_TYPE_ENUM } from '@/domain/carer/enum/carer-type.enums';
import { TimeToLiveSchema } from '@/domain/core/constant/time-to-live.constants';
import { GenerateQRDTOSchema } from '@/domain/core/dto/qr.dto';

export const InviteSecondaryCarerQRPayloadSchema = CarerEntitySchema.pick({
  id: true,
  name: true,
  isPrimary: true,
}).extend({
  type: z.literal(CARER_TYPE_ENUM.SECONDARY),
  timeToLive: TimeToLiveSchema,
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
