import type { TCarerCreateDTO } from '@/domain/carer/dto/carer.dto';
import type { TCarerEntity } from '@/domain/carer/entity/carer.entity';
import type { TID } from '@/domain/core/schemas/id.schema';

export interface ICarerPort {
  create(dto: TCarerCreateDTO): Promise<TCarerEntity>;
  getById(id: TID): Promise<TCarerEntity | null>;
  getAll(): Promise<TCarerEntity[]>;
  existsAny(): Promise<boolean>;
}
