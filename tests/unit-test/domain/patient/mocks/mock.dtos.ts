/// <reference types="jest" />

import type { TPatientCreateDTO } from '@/domain/patient/dto/patient.dto';
import { AUTONOMY_LEVEL } from '@/domain/patient/enum/autonomy-level.enum';
import { SEX } from '@/domain/patient/enum/sex.enum';

export const mockPatientCreateDTO = (
  overrides: Partial<TPatientCreateDTO> = {}
): TPatientCreateDTO => ({
  name: 'Baby',
  birthDate: 1700000000000,
  sex: SEX.MALE,
  autonomyLevel: AUTONOMY_LEVEL.NONE,
  ...overrides,
});
