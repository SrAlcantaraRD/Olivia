import { z } from 'zod';

import { IDSchema } from '@/domain/core/schemas/id.schema';
import { InviteBundleSchema } from '@/domain/carer/entity/invite-bundle.entity';

export const RequestImportInviteSchema = z.object({
  bundle: InviteBundleSchema,
});

export const ResponseImportInviteSchema = z.object({
  carerId: IDSchema,
});

export type TRequestImportInvite = z.infer<typeof RequestImportInviteSchema>;
export type TResponseImportInvite = z.infer<typeof ResponseImportInviteSchema>;
