import type { TID } from '@/domain/core/schemas/id.schema';
import type {
  TRecordField,
  TRecordFieldCreate,
} from '@/domain/module/entity/record-field.entity';

export interface IRecordFieldPort {
  getAll(): Promise<TRecordField[]>;
  batchUpsert(
    recordID: TID,
    data: TRecordFieldCreate[],
    date: Date
  ): Promise<TRecordField[]>;
}
