/// <reference types="jest" />

import type {
  TRecordFieldSync,
  TRecordSync,
  TRecordSyncBundle,
} from '@/domain/core/dto/sync-record.dto';
import { QR_KEY } from '@/domain/core/enum/qr-key.enum';

export function mockRecordFieldSync(
  overrides?: Partial<TRecordFieldSync>
): TRecordFieldSync {
  return {
    [QR_KEY.RECORD_FIELD_ID]: 1,
    [QR_KEY.RECORD_FIELD_VALUE]: 'test-value',
    ...overrides,
  } satisfies TRecordFieldSync;
}

export function mockRecordSync(overrides?: Partial<TRecordSync>): TRecordSync {
  return {
    [QR_KEY.RECORD_MODULE_ID]: 10,
    [QR_KEY.RECORD_DATE]: new Date('2024-01-01').getTime().toString(),
    [QR_KEY.RECORD_FIELDS]: [
      mockRecordFieldSync(),
      mockRecordFieldSync({
        [QR_KEY.RECORD_FIELD_ID]: 2,
        [QR_KEY.RECORD_FIELD_VALUE]: 'another-value',
      }),
    ],
    ...overrides,
  } satisfies TRecordSync;
}

export function mockRecordSyncBundle(
  overrides?: Partial<TRecordSyncBundle>
): TRecordSyncBundle {
  return {
    [QR_KEY.ORIGIN_CARER_ID]: 5,
    [QR_KEY.RECORDS]: [
      mockRecordSync(),
      mockRecordSync({
        [QR_KEY.RECORD_MODULE_ID]: 20,
        [QR_KEY.RECORD_DATE]: new Date('2024-01-02').getTime().toString(),
      }),
    ],
    ...overrides,
  } satisfies TRecordSyncBundle;
}

export function mockInvalidRecordSyncBundle(): Partial<TRecordSyncBundle> {
  return {
    // Missing required ORIGIN_CARER_ID
    [QR_KEY.RECORDS]: [],
    // Empty records array (violates min(1))
  };
}
