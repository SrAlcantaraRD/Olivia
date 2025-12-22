import z from 'zod';

import { CarerEntitySchema } from '@/domain/carer/entity/carer.entity';
import { GenerateQRDTOSchema } from '@/domain/core/dto/qr.dto';
import { IDSchema } from '@/domain/core/schemas/id.schema';

export const InviteSecondaryCarerQRPayloadSchema = CarerEntitySchema.pick({
  id: true,
  name: true,
}).extend({
  expiresAt: z.date(),
  activeModuleIDList: z.array(IDSchema),
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
