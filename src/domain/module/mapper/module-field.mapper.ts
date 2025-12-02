import type { TBaseMapper } from '@/domain/core';
import type { TModuleFieldDTO } from '@/domain/module/dto/module-field.dto';
import type { TModuleFieldEntity } from '@/domain/module/entity/module-field.entity';
import { moduleMapper } from '@/domain/module/mapper/module.mapper';

export const moduleFieldMapper: TBaseMapper<
  TModuleFieldEntity,
  TModuleFieldDTO
> = {
  toDTO: (entity: TModuleFieldEntity): TModuleFieldDTO => {
    return {
      uuid: entity.uuid,
      createdAt: entity.createdAt,
      moduleId: entity.moduleId,
      title: entity.title,
      description: entity.description,
      type: entity.type,
      values: entity.values,
      required: entity.required,
      order: entity.order,

      ...(entity.module && {
        module: moduleMapper.toDTO(entity.module),
      }),
    };
  },
};
