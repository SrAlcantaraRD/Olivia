import type { z } from 'zod';

import { CarerEntitySchema } from '@/domain/carer/entity/carer.entity';
import {
  GenerateCreateDTOSchema,
  GenerateDTOSchema,
} from '@/domain/core/entity/base-dto.entity';

export const CarerCreateDTOSchema = GenerateCreateDTOSchema(CarerEntitySchema);
export const CarerReadDTOSchema = GenerateDTOSchema(CarerEntitySchema);

export type TCarerCreateDTO = z.infer<typeof CarerCreateDTOSchema>;
export type TCarerDTO = z.infer<typeof CarerReadDTOSchema>;
