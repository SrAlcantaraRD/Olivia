import { z } from 'zod';

import { GenerateCreateEntitySchema } from '@/domain/core/entity/base-dto.entity';
import { BaseEntitySchema } from '@/domain/core/entity/base-entity.entity';
import type { TModuleFieldEntity } from '@/domain/module/entity/module-field.entity';
import { ModuleKeySchema } from '@/domain/module/enum/module-key.enum';

export const ModuleEntitySchema = z.object({
  ...BaseEntitySchema.shape,
  name: z.string().min(1),
  description: z.string().optional(),
  key: ModuleKeySchema.optional(),
  active: z.boolean().optional(),
  ord: z.number().int().optional(),
});

export const ModuleCreateEntitySchema =
  GenerateCreateEntitySchema(ModuleEntitySchema);

export type TModuleEntity = z.infer<typeof ModuleEntitySchema> & {
  fieldList?: TModuleFieldEntity[];
};

export type TModuleCreateDTO = z.infer<typeof ModuleCreateEntitySchema>;
