/// <reference types="jest" />

import type {
  TInviteSecondaryCarerQR,
  TInviteSecondaryCarerQRActiveModule,
  TInviteSecondaryCarerQRPayload,
} from '@/domain/carer/dto/invite-secondary-carer.qr.dto';
import { QR_KEY } from '@/domain/core/enum/qr-key.enum';

export function mockInviteSecondaryCarerQRActiveModule(
  overrides?: Partial<TInviteSecondaryCarerQRActiveModule>
): TInviteSecondaryCarerQRActiveModule {
  return {
    [QR_KEY.MODULE_ID]: 'test-module-id',
    [QR_KEY.MODULE_FIELD_LIST]: ['field-1', 'field-2'],
    ...overrides,
  } satisfies TInviteSecondaryCarerQRActiveModule;
}

export function mockInviteSecondaryCarerQRPayload(
  overrides?: Partial<TInviteSecondaryCarerQRPayload>
): TInviteSecondaryCarerQRPayload {
  return {
    [QR_KEY.ORIGIN_CARER_ID]: 'test-carer-id',
    [QR_KEY.ORIGIN_CARER_NAME]: 'Test Carer',
    [QR_KEY.ORIGIN_CARER_EXPIRES_AT]: new Date('2024-12-31'),
    [QR_KEY.MODULE_LIST]: [
      mockInviteSecondaryCarerQRActiveModule(),
      mockInviteSecondaryCarerQRActiveModule({
        [QR_KEY.MODULE_ID]: 'test-module-id-2',
        [QR_KEY.MODULE_FIELD_LIST]: ['field-3'],
      }),
    ],
    ...overrides,
  } satisfies TInviteSecondaryCarerQRPayload;
}

export function mockInviteSecondaryCarerQR(
  overrides?: Partial<TInviteSecondaryCarerQR>
): TInviteSecondaryCarerQR {
  return {
    [QR_KEY.METADATA]: {
      [QR_KEY.VERSION]: '1.0.0',
    },
    [QR_KEY.PAYLOAD]: mockInviteSecondaryCarerQRPayload(),
    ...overrides,
  } satisfies TInviteSecondaryCarerQR;
}
