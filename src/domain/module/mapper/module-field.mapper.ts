import type { TBaseMapper } from '@/domain/core';
import type { TModuleFieldDTO } from '@/domain/module/dto/module-field.dto';
import type { TModuleFieldEntity } from '@/domain/module/entity/module-field.entity';

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
      ...(entity.description !== undefined && {
        description: entity.description,
      }),
      ...(entity.type !== undefined && { type: entity.type }),
      ...(entity.values !== undefined && { values: entity.values }),
      ...(entity.required !== undefined && { required: entity.required }),
      ...(entity.ord !== undefined && { ord: entity.ord }),
    } as unknown as TModuleFieldDTO;
  },
};
