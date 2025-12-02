/// <reference types="jest" />

import type { TLoggerPort } from '@/domain/core';

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
