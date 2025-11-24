import { z } from 'zod';

import { AuthStageSchema, type TUserEntity } from '@/domain/auth';
import { BaseEntitySchema } from '@/domain/core/entity/base-entity.entity';
import { EmailSchema } from '@/domain/core/schemas';

export const AuthEntitySchema = BaseEntitySchema.merge(
  z.object({
    email: EmailSchema,
    password: z.string().min(8),
    stage: AuthStageSchema,
  })
);

export type TAuthEntity = z.infer<typeof AuthEntitySchema> & {
  user?: TUserEntity;
};
