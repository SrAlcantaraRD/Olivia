import { z } from 'zod';

import { IDSchema } from '@/domain/core/schemas/id.schema';
import { InviteBundleSchema } from '@/domain/carer/entity/invite-bundle.entity';

export const RequestCreateInviteSchema = z.object({
  carerId: IDSchema,
});

export const ResponseCreateInviteSchema = InviteBundleSchema;

export type TRequestCreateInvite = z.infer<typeof RequestCreateInviteSchema>;
export type TResponseCreateInvite = z.infer<typeof ResponseCreateInviteSchema>;
