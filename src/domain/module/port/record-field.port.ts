import type { TID } from '@/domain/core/schemas/id.schema';
import type {
  TRecordField,
  TRecordFieldCreate,
} from '@/domain/module/entity/record-field.entity';

export interface IRecordFieldPort {
  getAllByFieldID(fieldID: TID): Promise<TRecordField[]>;
  batchUpsert(
    recordID: TID,
    data: TRecordFieldCreate[],
    date: Date
  ): Promise<TRecordField[]>;
}
