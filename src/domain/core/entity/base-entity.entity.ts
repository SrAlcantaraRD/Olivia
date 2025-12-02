import { z } from 'zod';

import { statusSchema } from '@/domain/core/enum/status.enum';
import { IDSchema } from '@/domain/core/schemas/id.schema';
import { UUIDSchema } from '@/domain/core/schemas/uuid.schema';

export const BaseEntitySchema = z.object({
  id: IDSchema,
  uuid: UUIDSchema,
  status: statusSchema,
  createdAt: z.string(),
  updatedAt: z.string().optional(),
  deletedAt: z.string().optional(),
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
