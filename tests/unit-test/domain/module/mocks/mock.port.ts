/// <reference types="jest" />

import type { IModulePort } from '@/domain/module/port/module.port';
import type { IModuleFieldPort } from '@/domain/module/port/module-field.port';
import type { IRecordPort } from '@/domain/module/port/record.port';
import type { IRecordFieldPort } from '@/domain/module/port/record-field.port';

export function mockModulePort(
  overrides?: Partial<Record<keyof IModulePort, jest.Mock>>
): jest.Mocked<IModulePort> {
  return {
    getAll: jest.fn(),
    batchActivate: jest.fn(),
    ...overrides,
  } satisfies jest.Mocked<IModulePort>;
}

export function mockModuleFieldPort(
  overrides?: Partial<Record<keyof IModuleFieldPort, jest.Mock>>
): jest.Mocked<IModuleFieldPort> {
  return {
    getAll: jest.fn(),
    getAllByModuleId: jest.fn(),
    ...overrides,
  } satisfies jest.Mocked<IModuleFieldPort>;
}

export function mockRecordPort(
  overrides?: Partial<Record<keyof IRecordPort, jest.Mock>>
): jest.Mocked<IRecordPort> {
  return {
    create: jest.fn(),
    getByID: jest.fn(),
    getAll: jest.fn(),
    getRecentRecords: jest.fn(),
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
    getAll: jest.fn(),
    batchCreate: jest.fn(),
    ...overrides,
  } satisfies jest.Mocked<IRecordFieldPort>;
}
