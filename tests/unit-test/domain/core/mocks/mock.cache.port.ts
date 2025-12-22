/// <reference types="jest" />

import type { ICachePort } from '@/domain/core/port/cache.port';

export function mockCachePort(
  overrides?: Partial<Record<keyof ICachePort, jest.Mock>>
): jest.Mocked<ICachePort> {
  return {
    set: jest.fn(),
    get: jest.fn(),
    delete: jest.fn(),
    ...overrides,
  } as unknown as jest.Mocked<ICachePort>;
}
