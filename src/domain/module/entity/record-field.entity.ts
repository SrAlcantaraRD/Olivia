import { z } from 'zod';

import { BaseEntitySchema } from '@/domain/core/entity/base-entity.entity';
import { IDSchema } from '@/domain/core/schemas/id.schema';
import type { TModuleField } from '@/domain/module/entity/module-field.entity';
import type { TRecord } from '@/domain/module/entity/record.entity';

export const RecordFieldSchema = z.object({
  ...BaseEntitySchema.shape,
  recordID: IDSchema,
  fieldID: IDSchema,
  value: z.string().min(1),
});

export const RecordFieldCreateSchema = RecordFieldSchema.omit({
  id: true,
  recordID: true,
  status: true,
});

export type TRecordField = z.infer<typeof RecordFieldSchema> & {
  record?: TRecord;
  moduleField?: TModuleField;
};

export type TRecordFieldCreate = z.infer<typeof RecordFieldCreateSchema>;
