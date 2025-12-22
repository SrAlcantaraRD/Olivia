/// <reference types="jest" />

import type { TLoggerPort } from '@/domain/core/adapter/logger.adapter';
import type { ICachePort } from '@/domain/core/port/cache.port';

export function mockLoggerPort(
  overrides?: Partial<Record<keyof TLoggerPort, jest.Mock>>
): jest.Mocked<TLoggerPort> {
  return {
    warn: jest.fn(),
    info: jest.fn(),
    debug: jest.fn(),
    error: jest.fn(),
    custom: jest.fn(),
    setSeverity: jest.fn(),
    devNotice: jest.fn(),
    disable: jest.fn(),
    enable: jest.fn(),
    extend: jest.fn(),
    getExtensions: jest.fn(),
    getSeverity: jest.fn(),
    patchConsole: jest.fn(),
    ...overrides,
  } satisfies jest.Mocked<TLoggerPort>;
}

export function mockCachePort(
  overrides?: Partial<Record<keyof ICachePort, jest.Mock>>
): jest.Mocked<ICachePort> {
  return {
    delete: jest.fn().mockResolvedValue(undefined),
    get: jest.fn().mockResolvedValue(null),
    set: jest.fn().mockResolvedValue(undefined),
    clearAll: jest.fn().mockResolvedValue(undefined),
    ...overrides,
  } satisfies jest.Mocked<ICachePort>;
}

export const mockSecureStorePort = (
  overrides?: Partial<Record<keyof ICachePort, jest.Mock>>
) => mockCachePort(overrides);
