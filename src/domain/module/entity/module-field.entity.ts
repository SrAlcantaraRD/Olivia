import { z } from 'zod';

// import type { CreateFrom } from '@/domain/core/entity/base-dto.entity';
import { GenerateCreateEntitySchema } from '@/domain/core/entity/base-dto.entity';
import { BaseEntitySchema } from '@/domain/core/entity/base-entity.entity';
import { ModuleFieldTypeSchema } from '@/domain/module/enum/module-field-type.enum';

export const ModuleFieldEntitySchema = z.object({
  ...BaseEntitySchema.shape,
  moduleId: z.number().int(),
  title: z.string().min(1),
  description: z.string().optional(),
  type: ModuleFieldTypeSchema,
  values: z.string().optional(),
  required: z.boolean().optional(),
  ord: z.number().int().optional(),
});

export const ModuleFieldCreateEntitySchema = GenerateCreateEntitySchema(
  ModuleFieldEntitySchema
);

export type TModuleFieldEntity = z.infer<typeof ModuleFieldEntitySchema>;
export type TModuleFieldCreateDTO = z.infer<
  typeof ModuleFieldCreateEntitySchema
>;
