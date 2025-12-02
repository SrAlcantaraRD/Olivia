import type { TID } from '@/domain/core';
import type {
  TPatientCreateEntity,
  TPatientEntity,
} from '@/domain/patient/entity/patient.entity';

export interface IPatientPort {
  create(dto: TPatientCreateEntity): Promise<TPatientEntity>;
  getById(id: TID): Promise<TPatientEntity | null>;
  getAll(): Promise<TPatientEntity[]>;
}
