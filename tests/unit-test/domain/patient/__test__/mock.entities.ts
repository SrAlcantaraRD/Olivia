/// <reference types="jest" />

import type { TPatientEntity } from '@/domain/patient/entity/patient.entity';
import { AUTONOMY_LEVEL } from '@/domain/patient/enum/autonomy-level.enum';
import { SEX } from '@/domain/patient/enum/sex.enum';

export const mockPatientEntity = (
  overrides: Partial<TPatientEntity> = {}
): TPatientEntity => ({
  id: 1,
  uuid: 'patient-uuid-123',
  name: 'Jane Patient',
  birthDate: 1700000000000,
  sex: SEX.FEMALE,
  autonomyLevel: AUTONOMY_LEVEL.LOW,
  status: 1,
  createdAt: new Date('2024-01-01T00:00:00Z'),
  deletedAt: undefined,
  ...overrides,
});
