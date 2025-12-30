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
  getAll(criteria: {
    moduleId?: TID;
    fieldId?: TID;
    recordId?: TID;
    dateFrom?: Date;
    dateTo?: Date;
    carerID?: TID;
  }): Promise<TRecordField[]>;
}
