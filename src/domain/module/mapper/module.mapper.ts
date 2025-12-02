import type { TBaseMapper } from '@/domain/core';
import type { TModuleDTO } from '@/domain/module/dto/module.dto';
import type { TModuleEntity } from '@/domain/module/entity/module.entity';

export const moduleMapper: TBaseMapper<TModuleEntity, TModuleDTO> = {
  toDTO: (entity: TModuleEntity): TModuleDTO => {
    return {
      uuid: entity.uuid,
      createdAt: entity.createdAt,
      name: entity.name,
      ...(entity.description !== undefined && {
        description: entity.description,
      }),
      ...(entity.key !== undefined && { key: entity.key }),
      ...(entity.active !== undefined && { active: entity.active }),
      ...(entity.ord !== undefined && { ord: entity.ord }),
    } as unknown as TModuleDTO;
  },
};
