import { z } from 'zod';

import { BaseEntitySchema } from '@/domain/core/entity/base-entity.entity';
import { IDSchema } from '@/domain/core/schemas';
import type { TAuthEntity } from './auth.entity';

export const UserEntitySchema = BaseEntitySchema.merge(
  z.object({
    authID: IDSchema,
    name: z.string().min(1),
    surname: z.string().min(1),
  })
);

export type TUserEntity = z.infer<typeof UserEntitySchema> & {
  auth?: TAuthEntity;
};
