import type { TID } from '@/domain/core/schemas/id.schema';
import type {
  TRecordField,
  TRecordFieldCreate,
} from '@/domain/module/entity/record-field.entity';

export interface IRecordFieldPort {
  getAll(): Promise<TRecordField[]>;
  batchCreate(
    recordID: TID,
    data: TRecordFieldCreate[]
  ): Promise<TRecordField[]>;
}
