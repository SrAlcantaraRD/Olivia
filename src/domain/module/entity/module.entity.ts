import { z } from 'zod';

import { GenerateCreateEntitySchema } from '@/domain/core/entity/base-dto.entity';
import { BaseEntitySchema } from '@/domain/core/entity/base-entity.entity';
import type { TModuleField } from '@/domain/module/entity/module-field.entity';
import type { TRecord } from '@/domain/module/entity/record.entity';
import { ModuleKeySchema } from '@/domain/module/enum/module-key.enum';

export const ModuleSchema = z.object({
  ...BaseEntitySchema.shape,
  name: z.string().min(1),
  description: z.string(),
  code: ModuleKeySchema,
  isActive: z.boolean(),
});

export const ModuleCreateSchema = GenerateCreateEntitySchema(ModuleSchema);

export type TModule = z.infer<typeof ModuleSchema> & {
  fieldList?: TModuleField[];
  recordList?: TRecord[];
};

export type TModuleCreate = z.infer<typeof ModuleCreateSchema>;
