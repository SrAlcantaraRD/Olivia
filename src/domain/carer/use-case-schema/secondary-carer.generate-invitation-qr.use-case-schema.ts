import { z } from 'zod';

import { InviteSecondaryCarerQRSchema } from '@/domain/carer/dto/invite-secondary-carer.qr.dto';
import { TimeToLiveSchema } from '@/domain/core/constant/time-to-live.constants';
import { QRBundleSchema } from '@/domain/core/dto/qr.dto';
import { IDSchema } from '@/domain/core/schemas/id.schema';

export const RequestSecondaryCarerGenerateInvitationQRSchema = z.object({
  carerID: IDSchema,
  timeToLive: TimeToLiveSchema,
});

export const ResponseSecondaryCarerGenerateInvitationQRSchema = z.object({
  qrData: InviteSecondaryCarerQRSchema,
  qrBundle: QRBundleSchema,
});

export type TRequestSecondaryCarerGenerateInvitationQR = z.infer<
  typeof RequestSecondaryCarerGenerateInvitationQRSchema
>;

export type TResponseSecondaryCarerGenerateInvitationQR = z.infer<
  typeof ResponseSecondaryCarerGenerateInvitationQRSchema
>;
