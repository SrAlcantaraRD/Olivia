import { z } from 'zod';

import { GenerateCreateEntitySchema } from '@/domain/core/entity/base-dto.entity';
import { BaseEntitySchema } from '@/domain/core/entity/base-entity.entity';
import { IDSchema } from '@/domain/core/schemas/id.schema';
import type { TModule } from '@/domain/module/entity/module.entity';
import type { TRecordField } from '@/domain/module/entity/record-field.entity';

export const RecordSchema = z.object({
  ...BaseEntitySchema.shape,
  moduleID: IDSchema,
  data: z.string().min(1),
  synced: z.boolean(),
});

export const RecordCreateSchema = GenerateCreateEntitySchema(RecordSchema);

export type TRecord = z.infer<typeof RecordSchema> & {
  module?: TModule;
  fieldList?: TRecordField[];
};

export type TRecordCreate = z.infer<typeof RecordCreateSchema>;
