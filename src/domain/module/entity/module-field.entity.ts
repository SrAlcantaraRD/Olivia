import { z } from 'zod';

// import type { CreateFrom } from '@/domain/core/entity/base-dto.entity';
import { GenerateCreateEntitySchema } from '@/domain/core/entity/base-dto.entity';
import { BaseEntitySchema } from '@/domain/core/entity/base-entity.entity';
import type { TModule } from '@/domain/module/entity/module.entity';
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
  //TODO: add "isActive" field to handler "development" fields
  // TODO: add an "icon" field to show in the UI
});

export const ModuleFieldCreateEntitySchema = GenerateCreateEntitySchema(
  ModuleFieldEntitySchema
);

export type TModuleFieldEntity = z.infer<typeof ModuleFieldEntitySchema> & {
  module: TModule;
};

export type TModuleFieldCreateDTO = z.infer<
  typeof ModuleFieldCreateEntitySchema
>;
