import { z } from 'zod';

// import type { CreateFrom } from '@/domain/core/entity/base-dto.entity';
import { GenerateCreateEntitySchema } from '@/domain/core/entity/base-dto.entity';
import { BaseEntitySchema } from '@/domain/core/entity/base-entity.entity';
import type { TModuleEntity } from '@/domain/module/entity/module.entity';
import { ModuleFieldTypeSchema } from '@/domain/module/enum/module-field-type.enum';

export const ModuleFieldEntitySchema = z.object({
  ...BaseEntitySchema.shape,
  moduleId: z.number().int(),
  title: z.string().min(1),
  description: z.string(),
  type: ModuleFieldTypeSchema,
  values: z.string(),
  required: z.boolean(),
  order: z.number().int(),
});

export const ModuleFieldCreateEntitySchema = GenerateCreateEntitySchema(
  ModuleFieldEntitySchema
);

export type TModuleFieldEntity = z.infer<typeof ModuleFieldEntitySchema> & {
  module: TModuleEntity;
};

export type TModuleFieldCreateDTO = z.infer<
  typeof ModuleFieldCreateEntitySchema
>;
