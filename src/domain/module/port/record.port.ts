import type { TID } from '@/domain/core/schemas/id.schema';
import type {
  TRecord,
  TRecordCreate,
} from '@/domain/module/entity/record.entity';

export interface IRecordPort {
  upsert(data: TRecordCreate): Promise<TRecord>;
  getPendingToSynchronized(): Promise<TRecord[]>;
  getCountsByModule(criteria?: {
    startDate?: Date;
    endDate?: Date;
  }): Promise<{ moduleID: TID; count: number }[]>;
  getCountsByDay(criteria?: {
    moduleID?: TID;
    startDate?: Date;
    endDate?: Date;
  }): Promise<{ day: string; count: number }[]>;
  getFieldDistribution(criteria: {
    fieldID: TID;
    startDate?: Date;
    endDate?: Date;
  }): Promise<{ value: string; count: number }[]>;
}
