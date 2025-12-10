/// <reference types="jest" />

import type {
  TPatient,
  TPatientCreate,
} from '@/domain/patient/entity/patient.entity';
import { AUTONOMY_LEVEL_ENUM } from '@/domain/patient/enum/autonomy-level.enum';
import { SEX_ENUM } from '@/domain/patient/enum/sex.enum';

export const mockPatientEntity = (
  overrides: Partial<TPatient> = {}
): TPatient => ({
  id: 1,
  name: 'Jane Patient',
  birthDate: 1700000000000,
  sex: SEX_ENUM.FEMALE,
  autonomyLevel: AUTONOMY_LEVEL_ENUM.LOW,
  status: 1,
  ...overrides,
});

export const mockPatientCreate = (
  overrides: Partial<TPatientCreate> = {}
): TPatientCreate => ({
  name: 'Jane Patient',
  birthDate: 1700000000000,
  sex: SEX_ENUM.FEMALE,
  autonomyLevel: AUTONOMY_LEVEL_ENUM.LOW,
  ...overrides,
});
