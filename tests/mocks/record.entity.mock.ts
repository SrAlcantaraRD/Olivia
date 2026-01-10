/// <reference types="jest" />

import { STATUS_ENUM } from '@/domain/core/enum/status.enum';
import type {
  TRecord,
  TRecordCreate,
} from '@/domain/module/entity/record.entity';

export function mockRecord(overrides?: Partial<TRecord>): TRecord {
  return {
    id: -1,
    status: STATUS_ENUM.ACTIVE,
    createdAt: new Date('2024-01-01'),
    moduleID: -2,
    carerID: -3,
    synchronized: false,
    ...overrides,
  } satisfies TRecord;
}

export function mockRecordEntityCreate(
  overrides?: Partial<TRecordCreate>
): TRecordCreate {
  return {
    moduleID: -2,
    carerID: -3,
    synchronized: false,
    createdAt: new Date('2024-01-01'),
    recordFieldList: [],
    ...overrides,
  } satisfies TRecordCreate;
}

export function mockSynchronizedRecord(overrides?: Partial<TRecord>): TRecord {
  return mockRecord({
    id: -1,
    synchronized: true,
    ...overrides,
  });
}
