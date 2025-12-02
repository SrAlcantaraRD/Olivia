import type { TCarerDTO } from '@/domain/carer/dto/carer.dto';
import type { TCarerEntity } from '@/domain/carer/entity/carer.entity';
import type { TBaseMapper } from '@/domain/core';

export const carerMapper: TBaseMapper<TCarerEntity, TCarerDTO> = {
  toDTO: (entity: TCarerEntity): TCarerDTO => {
    return {
      uuid: entity.uuid,
      createdAt: entity.createdAt,
      name: entity.name,
      type: entity.type,
      isPrimary: entity.isPrimary,
      pinHash: entity.pinHash,
    };
  },
};
