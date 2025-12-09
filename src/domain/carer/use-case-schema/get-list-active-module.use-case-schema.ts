import { z } from 'zod';

import { ModuleDTOSchema } from '@/domain/module/dto/module.dto';

export const RequestGetListActiveModuleSchema = z.void();

export const ResponseGetListActiveModuleSchema = z.object({
  items: z.array(ModuleDTOSchema),
});

export type TGetListActiveModuleRequest = z.infer<
  typeof RequestGetListActiveModuleSchema
>;
export type TGetListActiveModuleResponse = z.infer<
  typeof ResponseGetListActiveModuleSchema
>;
