import { z } from 'zod';

// import type { CreateFrom } from '@/domain/core/entity/base-dto.entity';
import { GenerateCreateEntitySchema } from '@/domain/core/entity/base-dto.entity';
import { BaseEntitySchema } from '@/domain/core/entity/base-entity.entity';
import type { TModule } from '@/domain/module/entity/module.entity';
import type { TRecordField } from '@/domain/module/entity/record-field.entity';
import { ModuleFieldKeySchema } from '@/domain/module/enum/module-field-key.enum';
import {
  MODULE_FIELD_TYPE_ENUM,
  ModuleFieldTypeSchema,
} from '@/domain/module/enum/module-field-type.enum';
import { ModuleFieldSelectValuesJsonStringSchema } from '@/domain/module/schemas/module-field-values.schema';

export const ModuleFieldSchema = z
  .object({
    ...BaseEntitySchema.shape,
    moduleId: z.number().int(),
    code: ModuleFieldKeySchema,
    type: ModuleFieldTypeSchema,
    values: z.string(), // TODO: change to z.array(z.string())
    required: z.boolean(),
    order: z.number().int(),
    //TODO: add "isActive" field to handler "development" fields
    // TODO: add an "icon" field to show in the UI
  })
  .superRefine((data, context) => {
    if (data.type !== MODULE_FIELD_TYPE_ENUM.SELECT) return;

    const result = ModuleFieldSelectValuesJsonStringSchema.safeParse(
      data.values
    );

    if (!result.success) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['values'],
        message: 'validation.module-field.values.select.json-array.error',
      });
    }
  });

export const ModuleFieldCreateSchema =
  GenerateCreateEntitySchema(ModuleFieldSchema);

export type TModuleField = z.infer<typeof ModuleFieldSchema> & {
  module?: TModule;
  recordFieldList?: TRecordField[];
};

export type TModuleFieldCreate = z.infer<typeof ModuleFieldCreateSchema>;
