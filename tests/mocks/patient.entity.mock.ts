/// <reference types="jest" />

import type {
  TPatient,
  TPatientCreate,
} from '@/domain/patient/entity/patient.entity';
import { AUTONOMY_LEVEL_ENUM } from '@/domain/patient/enum/autonomy-level.enum';
import { SEX_ENUM } from '@/domain/patient/enum/sex.enum';

export function mockPatient(overrides?: Partial<TPatient>): TPatient {
  return {
    id: 'test-patient-id',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    name: 'Test Patient',
    birthDate: new Date('2000-01-01').getTime(),
    sex: SEX_ENUM.FEMALE,
    autonomyLevel: AUTONOMY_LEVEL_ENUM.MEDIUM,
    ...overrides,
  } satisfies TPatient;
}

export function mockPatientCreate(
  overrides?: Partial<TPatientCreate>
): TPatientCreate {
  return {
    name: 'Test Patient',
    birthDate: new Date('2000-01-01').getTime(),
    sex: SEX_ENUM.FEMALE,
    autonomyLevel: AUTONOMY_LEVEL_ENUM.MEDIUM,
    ...overrides,
  } satisfies TPatientCreate;
}

// Legacy exports for backward compatibility
export const mockPatientEntity = mockPatient;
export const mockPatientCreateLegacy = mockPatientCreate;
