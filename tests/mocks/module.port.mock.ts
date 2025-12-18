/// <reference types="jest" />

import type { IModulePort } from '@/domain/module/port/module.port';

export function mockModulePort(
  overrides?: Partial<Record<keyof IModulePort, jest.Mock>>
): jest.Mocked<IModulePort> {
  return {
    batchActivate: jest.fn(),
    getAll: jest.fn(),
    ...overrides,
  } satisfies jest.Mocked<IModulePort>;
}
