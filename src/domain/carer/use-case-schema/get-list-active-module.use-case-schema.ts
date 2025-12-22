import { z } from 'zod';

import { ModuleSchema } from '@/domain/module/entity/module.entity';

export const RequestGetListActiveModuleSchema = z.void();

export const ResponseGetListActiveModuleSchema = z.object({
  items: z.array(ModuleSchema),
});

export type TGetListActiveModuleRequest = z.infer<
  typeof RequestGetListActiveModuleSchema
>;
export type TGetListActiveModuleResponse = z.infer<
  typeof ResponseGetListActiveModuleSchema
>;
