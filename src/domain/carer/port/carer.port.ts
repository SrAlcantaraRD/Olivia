import type {
  TCarerDTO,
  TCarerEntity,
} from '@/domain/carer/entity/carer.entity';

export interface ICarerPort {
  create(dto: TCarerDTO): Promise<TCarerEntity>;
  getById(id: number): Promise<TCarerEntity | null>;
  getAll(): Promise<TCarerEntity[]>;
}
