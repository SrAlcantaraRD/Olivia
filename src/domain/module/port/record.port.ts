import type { TID } from '@/domain/core/schemas/id.schema';
import type {
  TRecord,
  TRecordCreate,
} from '@/domain/module/entity/record.entity';

export interface IRecordPort {
  create(data: TRecordCreate): Promise<TRecord>;
  getByID(id: TID): Promise<TRecord | null>;
  getAll(): Promise<TRecord[]>;
  getRecentRecords(limit?: number): Promise<TRecord[]>;
  // Aggregations for reports
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
  getLatestRecordDateByModule(moduleID: TID): Promise<Date | null>;
}
