import type {
  TPatient,
  TPatientCreate,
} from '@/domain/patient/entity/patient.entity';

export interface IPatientPort {
  create(dto: TPatientCreate): Promise<TPatient>;
}
