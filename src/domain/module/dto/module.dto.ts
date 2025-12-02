import type { z } from 'zod';

import {
  GenerateCreateDTOSchema,
  GenerateDTOSchema,
} from '@/domain/core/entity/base-dto.entity';
import type { TModuleFieldDTO } from '@/domain/module/dto/module-field.dto';
import { ModuleEntitySchema } from '@/domain/module/entity/module.entity';

export const ModuleCreateDTOSchema =
  GenerateCreateDTOSchema(ModuleEntitySchema);
export const ModuleReadDTOSchema = GenerateDTOSchema(ModuleEntitySchema);

export type TModuleCreateDTO = z.infer<typeof ModuleCreateDTOSchema> & {
  fieldList?: TModuleFieldDTO[];
};

export type TModuleDTO = z.infer<typeof ModuleReadDTOSchema>;
