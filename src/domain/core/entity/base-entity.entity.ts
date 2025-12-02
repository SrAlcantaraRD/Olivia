import { z } from 'zod';

import { IDSchema, UUIDSchema } from '../schemas';

export const BaseEntitySchema = z.object({
  id: IDSchema,
  uuid: UUIDSchema,
  status: z.boolean(),
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
