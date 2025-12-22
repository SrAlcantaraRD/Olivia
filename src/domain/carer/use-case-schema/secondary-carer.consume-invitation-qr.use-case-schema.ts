import { z } from 'zod';

import { CarerEntitySchema } from '@/domain/carer/entity/carer.entity';
import { QRBundleSchema } from '@/domain/core/dto/qr.dto';

export const RequestSecondaryCarerConsumeInvitationQRSchema = z.object({
  qrBundle: QRBundleSchema,
});

export const ResponseSecondaryCarerConsumeInvitationQRSchema =
  CarerEntitySchema;

export type TRequestSecondaryCarerConsumeInvitation = z.infer<
  typeof RequestSecondaryCarerConsumeInvitationQRSchema
>;

export type TResponseSecondaryCarerConsumeInvitation = z.infer<
  typeof ResponseSecondaryCarerConsumeInvitationQRSchema
>;
