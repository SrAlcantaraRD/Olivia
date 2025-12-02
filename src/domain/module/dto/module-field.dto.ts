import type { z } from 'zod';

import {
  GenerateCreateDTOSchema,
  GenerateDTOSchema,
} from '@/domain/core/entity/base-dto.entity';
import { ModuleFieldEntitySchema } from '@/domain/module/entity/module-field.entity';

export const ModuleFieldCreateDTOSchema = GenerateCreateDTOSchema(
  ModuleFieldEntitySchema
);
export const ModuleFieldReadDTOSchema = GenerateDTOSchema(
  ModuleFieldEntitySchema
);

export type TModuleFieldCreateDTO = z.infer<typeof ModuleFieldCreateDTOSchema>;
export type TModuleFieldDTO = z.infer<typeof ModuleFieldReadDTOSchema>;
