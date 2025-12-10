import z from 'zod';

import { ModuleFieldSchema } from '@/domain/module/entity/module-field.entity';

export const RequestGetModuleFieldListSchema = z.object({
  moduleId: z.number().int(),
});

export const ResponseGetModuleFieldListSchema = z.object({
  items: z.array(ModuleFieldSchema),
});

export type TRequestGetModuleFieldList = z.infer<
  typeof RequestGetModuleFieldListSchema
>;
export type TResponseGetModuleFieldList = z.infer<
  typeof ResponseGetModuleFieldListSchema
>;
