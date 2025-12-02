/// <reference types="jest" />

import type { TPatientCreateDTO } from '@/domain/patient/dto/patient.dto';
import { AUTONOMY_LEVEL_ENUM } from '@/domain/patient/enum/autonomy-level.enum';
import { SEX_ENUM } from '@/domain/patient/enum/sex.enum';

export const mockPatientCreateDTO = (
  overrides: Partial<TPatientCreateDTO> = {}
): TPatientCreateDTO => ({
  name: 'Baby',
  birthDate: 1700000000000,
  sex: SEX_ENUM.MALE,
  autonomyLevel: AUTONOMY_LEVEL_ENUM.NONE,
  ...overrides,
});
