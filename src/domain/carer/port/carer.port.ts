import type { TCarer, TCarerCreate } from '@/domain/carer/entity/carer.entity';
import type { TID } from '@/domain/core/schemas/id.schema';

export interface ICarerPort {
  create(dto: TCarerCreate): Promise<TCarer>;
  getById(id: TID): Promise<TCarer | null>;
  getAll(): Promise<TCarer[]>;
  existsAny(): Promise<boolean>;
}
