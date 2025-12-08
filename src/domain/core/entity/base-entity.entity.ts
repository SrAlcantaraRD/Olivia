import { z } from 'zod';

import { statusSchema } from '@/domain/core/enum/status.enum';
import { IDSchema } from '@/domain/core/schemas/id.schema';

export const BaseEntitySchema = z.object({
  id: IDSchema,
  status: statusSchema,
});

export type TBaseEntity = z.infer<typeof BaseEntitySchema>;

export type TBaseEntityCreate = Omit<
  TBaseEntity,
  'id' | 'uuid' | 'createdAt' | 'deletedAt' | 'status'
>;

export type TBaseEntityDTO = Omit<TBaseEntity, 'id' | 'status' | 'deletedAt'>;
export type TBaseEntityCreateDTO = Omit<TBaseEntityCreate, 'id'>;

export interface TBaseMapper<
  Entity extends TBaseEntity,
  DTO extends TBaseEntityDTO,
> {
  toDTO: (entity: Entity) => DTO;
}
