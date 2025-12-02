import { z } from 'zod';

// Removed unused import
import { GenerateCreateEntitySchema } from '@/domain/core/entity/base-dto.entity';
import { BaseEntitySchema } from '@/domain/core/entity/base-entity.entity';
import { IDSchema } from '@/domain/core/schemas';
import type { TAuthEntity } from './auth.entity';

export const UserEntitySchema = BaseEntitySchema.extend(
  z.object({
    authID: IDSchema,
    name: z.string().min(1),
    surname: z.string().min(1),
  })
);

export const UserCreateEntitySchema =
  GenerateCreateEntitySchema(UserEntitySchema);

export type TUserEntity = z.infer<typeof UserEntitySchema> & {
  auth?: TAuthEntity;
};

export type TUserCreateEntity = z.infer<typeof UserCreateEntitySchema>;
