import type { TCarer, TCarerCreate } from '@/domain/carer/entity/carer.entity';
import type { STATUS_ENUM } from '@/domain/core/enum/status.enum';
import type { TID } from '@/domain/core/schemas/id.schema';

export interface ICarerPort {
  create(dto: TCarerCreate): Promise<TCarer>;
  getByID(id: TID): Promise<TCarer | null>;
  getAll(): Promise<TCarer[]>;
  existsAny(): Promise<boolean>;
  updateStatus(id: TID, status: STATUS_ENUM): Promise<TCarer>;
}
