import z from 'zod';

import { IDSchema } from '@/domain/core/schemas/id.schema';
import { ModuleSchema } from '@/domain/module/entity/module.entity';

export const RequestModuleListByIDListSchema = z.object({
  idList: z.array(IDSchema),
});

export const ResponseModuleListByIDListSchema = z.object({
  items: z.array(ModuleSchema),
});

export type TRequestModuleListByIDList = z.infer<
  typeof RequestModuleListByIDListSchema
>;

export type TResponseModuleListByIDList = z.infer<
  typeof ResponseModuleListByIDListSchema
>;
