import type { z } from 'zod';

import { UserEntitySchema } from '@/domain/auth/entity/user.entity';
import {
  GenerateCreateDTOSchema,
  GenerateDTOSchema,
} from '@/domain/core/entity/base-dto.entity';

export const UserCreateDTOSchema = GenerateCreateDTOSchema(UserEntitySchema);
export const UserReadDTOSchema = GenerateDTOSchema(UserEntitySchema);

export type TUserCreateDTO = z.infer<typeof UserCreateDTOSchema>;
export type TUserDTO = z.infer<typeof UserReadDTOSchema>;
