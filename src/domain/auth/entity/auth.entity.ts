import { z } from 'zod';

import { AuthStageSchema, type TUserEntity } from '@/domain/auth';
import { GenerateCreateEntitySchema } from '@/domain/core/entity/base-dto.entity';
import { BaseEntitySchema } from '@/domain/core/entity/base-entity.entity';
import { EmailSchema } from '@/domain/core/schemas';

export const AuthEntitySchema = BaseEntitySchema.extend(
  z.object({
    email: EmailSchema,
    password: z.string().min(8),
    stage: AuthStageSchema,
  })
);

export const AuthCreateEntitySchema =
  GenerateCreateEntitySchema(AuthEntitySchema);

export type TAuthEntity = z.infer<typeof AuthEntitySchema> & {
  user?: TUserEntity;
};

export type TAuthCreateEntity = z.infer<typeof AuthCreateEntitySchema>;
// (create type inferred via z.infer for consistency)
