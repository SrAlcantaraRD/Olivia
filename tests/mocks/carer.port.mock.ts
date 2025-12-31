/// <reference types="jest" />

import type { ICarerPort } from '@/domain/carer/port/carer.port';

export function mockCarerPort(
  overrides?: Partial<Record<keyof ICarerPort, jest.Mock>>
): jest.Mocked<ICarerPort> {
  return {
    create: jest.fn(),
    getByID: jest.fn(),
    getAll: jest.fn(),
    addSecondaryCarer: jest.fn(),
    updateStatus: jest.fn(),
    ...overrides,
  } satisfies jest.Mocked<ICarerPort>;
}
