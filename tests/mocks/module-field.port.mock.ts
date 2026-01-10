/// <reference types="jest" />

import type { IModuleFieldPort } from '@/domain/module/port/module-field.port';
import type { IRecordPort } from '@/domain/module/port/record.port';
import type { IRecordFieldPort } from '@/domain/module/port/record-field.port';

export function mockModuleFieldPort(
  overrides?: Partial<Record<keyof IModuleFieldPort, jest.Mock>>
): jest.Mocked<IModuleFieldPort> {
  return {
    getAllByModuleId: jest.fn(),
    batchActivate: jest.fn(),
    batchDeactivate: jest.fn(),
    ...overrides,
  } satisfies jest.Mocked<IModuleFieldPort>;
}

export function mockRecordPort(
  overrides?: Partial<Record<keyof IRecordPort, jest.Mock>>
): jest.Mocked<IRecordPort> {
  return {
    upsert: jest.fn(),
    getPendingToSynchronized: jest.fn(),
    getCountsByModule: jest.fn(),
    getCountsByDay: jest.fn(),
    getFieldDistribution: jest.fn(),
    ...overrides,
  } satisfies jest.Mocked<IRecordPort>;
}

export function mockRecordFieldPort(
  overrides?: Partial<Record<keyof IRecordFieldPort, jest.Mock>>
): jest.Mocked<IRecordFieldPort> {
  return {
    batchUpsert: jest.fn(),
    getAllByFieldID: jest.fn(),
    ...overrides,
  } satisfies jest.Mocked<IRecordFieldPort>;
}
