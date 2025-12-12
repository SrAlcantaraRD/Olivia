import type { TPatientCreate } from '@/domain/patient/entity/patient.entity';
import { SEX_ENUM } from '@/domain/patient/enum/sex.enum';
import { AUTONOMY_LEVEL_ENUM } from '@/domain/patient/enum/autonomy-level.enum';

export function mockPatientCreateDTO(): TPatientCreate {
  return {
    name: 'Test Patient',
    birthDate: 1577836800, // 2020-01-01
    sex: SEX_ENUM.MALE,
    autonomyLevel: AUTONOMY_LEVEL_ENUM.FULL,
  };
}
