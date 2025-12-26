import type { TRecordField } from '@/domain/module/entity/record-field.entity';

export type TRequestGetRecordFieldList = {
  fieldId: number;
};

export type TResponseGetRecordFieldList = TRecordField[];
