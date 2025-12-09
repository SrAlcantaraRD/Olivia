import z from 'zod';

import { ModuleSchema } from '@/domain/module/entity/module.entity';

export const RequestGetActiveModuleListSchema = z.void();

export const ResponseGetActiveModuleListSchema = z.object({
  items: z.array(ModuleSchema),
});

export type TRequestGetActiveModuleList = z.infer<
  typeof RequestGetActiveModuleListSchema
>;

export type TResponseGetActiveModuleList = z.infer<
  typeof ResponseGetActiveModuleListSchema
>;
