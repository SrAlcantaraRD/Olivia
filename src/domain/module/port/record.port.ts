import type {
  TRecord,
  TRecordCreate,
} from '@/domain/module/entity/record.entity';

export interface IRecordPort {
  create(data: TRecordCreate): Promise<TRecord>;
  getById(id: number): Promise<TRecord | null>;
  getAll(): Promise<TRecord[]>;
  // Aggregations for reports
  getCountsByModule(opts?: {
    start?: number;
    end?: number;
  }): Promise<{ moduleID: number; count: number }[]>;
  getCountsByDay(opts?: {
    start?: number;
    end?: number;
    moduleID?: number;
  }): Promise<{ day: string; count: number }[]>;
  getFieldDistribution(opts: {
    fieldID: number;
    moduleID?: number;
    start?: number;
    end?: number;
  }): Promise<{ value: string; count: number }[]>;
}
