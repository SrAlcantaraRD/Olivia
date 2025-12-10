import type {
  TRecord,
  TRecordCreate,
} from '@/domain/module/entity/record.entity';

export interface IRecordPort {
  create(data: TRecordCreate): Promise<TRecord>;
  getById(id: number): Promise<TRecord | null>;
  getAll(): Promise<TRecord[]>;
}

export default IRecordPort;
