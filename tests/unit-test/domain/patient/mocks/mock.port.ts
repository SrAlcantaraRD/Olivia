/// <reference types="jest" />

import type { IPatientPort } from '@/domain/patient/port/patient.port';

export function mockPatientPort(
  overrides?: Partial<Record<keyof IPatientPort, jest.Mock>>
): jest.Mocked<IPatientPort> {
  return {
    create: jest.fn(),
    getById: jest.fn(),
    getAll: jest.fn(),
    ...overrides,
  } satisfies jest.Mocked<IPatientPort>;
}
