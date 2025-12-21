import { z } from 'zod';

import { InviteSecondaryCarerQRSchema } from '@/domain/carer/dto/invite-secondary-carer.qr.dto';
import { TimeToLiveSchema } from '@/domain/core/constant/time-to-live.constants';
import { QRBundleSchema, QRDTOChunkListSchema } from '@/domain/core/dto/qr.dto';
import { IDSchema } from '@/domain/core/schemas/id.schema';

export const RequestGenerateInvitationQRForSecondaryCarerSchema = z.object({
  carerID: IDSchema,
  timeToLive: TimeToLiveSchema,
});

export const ResponseGenerateInvitationQRForSecondaryCarerSchema = z.object({
  qrData: InviteSecondaryCarerQRSchema,
  qrBundle: QRBundleSchema,
  qrChunkList: QRDTOChunkListSchema,
});

export type TRequestGenerateInvitationQRForSecondaryCarer = z.infer<
  typeof RequestGenerateInvitationQRForSecondaryCarerSchema
>;
export type TResponseGenerateInvitationQRForSecondaryCarer = z.infer<
  typeof ResponseGenerateInvitationQRForSecondaryCarerSchema
>;
