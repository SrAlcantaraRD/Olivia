/// <reference types="jest" />

import type { ISummaryModulePort } from '@/domain/summary/port/summary-module.port';
import type { ISummaryModuleFieldPort } from '@/domain/summary/port/summary-module-field.port';

export function mockSummaryModulePort(
  overrides?: Partial<Record<keyof ISummaryModulePort, jest.Mock>>
): jest.Mocked<ISummaryModulePort> {
  return {
    getDetails: jest.fn(),
    getAll: jest.fn(),
    getInList: jest.fn(),
    ...overrides,
  } satisfies jest.Mocked<ISummaryModulePort>;
}

export function mockSummaryModuleFieldPort(
  overrides?: Partial<Record<keyof ISummaryModuleFieldPort, jest.Mock>>
): jest.Mocked<ISummaryModuleFieldPort> {
  return {
    getByModuleID: jest.fn(),
    getDetails: jest.fn(),
    ...overrides,
  } satisfies jest.Mocked<ISummaryModuleFieldPort>;
}
