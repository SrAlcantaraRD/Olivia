/// <reference types="jest" />

import type {
  TInviteSecondaryCarerQR,
  TInviteSecondaryCarerQRActiveModule,
  TInviteSecondaryCarerQRPayload,
} from '@/domain/carer/dto/invite-secondary-carer.qr.dto';
import { QR_KEY } from '@/domain/core/enum/qr-key.enum';
import { mockQRMetadata } from '@/tests/mocks/qr.dto.mock';

export function mockInviteSecondaryCarerQRActiveModule(
  overrides?: Partial<TInviteSecondaryCarerQRActiveModule>
): TInviteSecondaryCarerQRActiveModule {
  return {
    [QR_KEY.MODULE_ID]: 1,
    [QR_KEY.MODULE_FIELD_LIST]: [1, 2],
    ...overrides,
  } satisfies TInviteSecondaryCarerQRActiveModule;
}

export function mockInviteSecondaryCarerQRPayload(
  overrides?: Partial<TInviteSecondaryCarerQRPayload>
): TInviteSecondaryCarerQRPayload {
  return {
    [QR_KEY.ORIGIN_CARER_ID]: 1,
    [QR_KEY.ORIGIN_CARER_NAME]: 'Test Carer',
    [QR_KEY.ORIGIN_CARER_EXPIRES_AT]: new Date('2030-12-31T23:00:00.000Z'),
    [QR_KEY.MODULE_LIST]: [
      mockInviteSecondaryCarerQRActiveModule(),
      mockInviteSecondaryCarerQRActiveModule({
        [QR_KEY.MODULE_ID]: 2,
        [QR_KEY.MODULE_FIELD_LIST]: [3],
      }),
    ],
    ...overrides,
  } satisfies TInviteSecondaryCarerQRPayload;
}

export function mockInviteSecondaryCarerQR(
  overrides?: Partial<TInviteSecondaryCarerQR>
): TInviteSecondaryCarerQR {
  return {
    [QR_KEY.METADATA]: mockQRMetadata(),
    [QR_KEY.PAYLOAD]: mockInviteSecondaryCarerQRPayload(),
    ...overrides,
  } satisfies TInviteSecondaryCarerQR;
}
