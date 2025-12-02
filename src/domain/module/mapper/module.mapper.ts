import type { TBaseMapper } from '@/domain/core';
import type { TModuleDTO } from '@/domain/module/dto/module.dto';
import type { TModuleEntity } from '@/domain/module/entity/module.entity';
import { moduleFieldMapper } from '@/domain/module/mapper/module-field.mapper';

export const moduleMapper: TBaseMapper<TModuleEntity, TModuleDTO> = {
  toDTO: (entity: TModuleEntity): TModuleDTO => {
    return {
      uuid: entity.uuid,
      createdAt: entity.createdAt,
      name: entity.name,
      description: entity.description,
      key: entity.key,
      active: entity.active,
      order: entity.order,

      ...(entity.fieldList && {
        fieldList: entity.fieldList.map(moduleFieldMapper.toDTO),
      }),
    };
  },
};
