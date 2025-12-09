import type { TBaseMapper } from '@/domain/core';
import type { TModuleDTO } from '@/domain/module/dto/module.dto';
import type { TModuleEntity } from '@/domain/module/entity/module.entity';
import { moduleFieldMapper } from '@/domain/module/mapper/module-field.mapper';

export const moduleMapper: TBaseMapper<TModuleEntity, TModuleDTO> = {
  toDTO: (entity: TModuleEntity): TModuleDTO => {
    return {
      code: entity.code,
      name: entity.name,
      description: entity.description,
      isActive: entity.isActive,

      ...(entity.fieldList && {
        fieldList: entity.fieldList.map(moduleFieldMapper.toDTO),
      }),
    };
  },
};
