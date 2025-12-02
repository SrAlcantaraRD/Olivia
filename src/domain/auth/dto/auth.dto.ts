import type { z } from 'zod';

import { AuthEntitySchema } from '@/domain/auth/entity/auth.entity';
import {
  GenerateCreateDTOSchema,
  GenerateDTOSchema,
} from '@/domain/core/entity/base-dto.entity';

export const AuthCreateDTOSchema = GenerateCreateDTOSchema(AuthEntitySchema);
export const AuthReadDTOSchema = GenerateDTOSchema(AuthEntitySchema);

export type TAuthCreateDTO = z.infer<typeof AuthCreateDTOSchema>;
export type TAuthDTO = z.infer<typeof AuthReadDTOSchema>;
