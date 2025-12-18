/// <reference types="jest" />

import type { TLoggerPort } from '@/domain/core/adapter/logger.adapter';
import type { ICachePort } from '@/domain/core/port/cache.port';
import type { INotifyPort } from '@/domain/core/port/notify.port';

export function mockCachePort(
  overrides?: Partial<Record<keyof ICachePort, jest.Mock>>
): jest.Mocked<ICachePort> {
  return {
    delete: jest.fn(),
    get: jest.fn(),
    set: jest.fn(),
    clearAll: jest.fn(),
    ...overrides,
  } satisfies jest.Mocked<ICachePort>;
}

export function mockSecureStorePort(
  overrides?: Partial<Record<keyof ICachePort, jest.Mock>>
): jest.Mocked<ICachePort> {
  return {
    delete: jest.fn(),
    get: jest.fn(),
    set: jest.fn(),
    clearAll: jest.fn(),
    ...overrides,
  } satisfies jest.Mocked<ICachePort>;
}
export function mockNavigationPort(
  overrides?: Partial<Record<keyof INotifyPort, jest.Mock>>
): jest.Mocked<INotifyPort> {
  return {
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    success: jest.fn(),
    loading: jest.fn(),
    ...overrides,
  } satisfies jest.Mocked<INotifyPort>;
}

export function mockNotifyPort(
  overrides?: Partial<Record<keyof INotifyPort, jest.Mock>>
): jest.Mocked<INotifyPort> {
  return {
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    success: jest.fn(),
    loading: jest.fn(),
    ...overrides,
  } satisfies jest.Mocked<INotifyPort>;
}

export function mockLoggerPort(
  overrides?: Partial<Record<keyof TLoggerPort, jest.Mock>>
): jest.Mocked<TLoggerPort> {
  return {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    custom: jest.fn(),
    devNotice: jest.fn(),
    setSeverity: jest.fn(),
    getSeverity: jest.fn(),
    getExtensions: jest.fn(),
    enable: jest.fn(),
    disable: jest.fn(),
    extend: jest.fn(),
    patchConsole: jest.fn(),
    ...overrides,
  } satisfies jest.Mocked<TLoggerPort>;
}
