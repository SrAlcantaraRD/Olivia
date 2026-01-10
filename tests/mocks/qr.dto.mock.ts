/// <reference types="jest" />

import type {
  TQR,
  TQRBundle,
  TQRChunk,
  TQRMetadata,
} from '@/domain/core/dto/qr.dto';
import { QR_BUNDLER_VERSION } from '@/domain/core/enum/qr.enum';
import { QR_KEY } from '@/domain/core/enum/qr-key.enum';

export function mockQRMetadata(overrides?: Partial<TQRMetadata>): TQRMetadata {
  return {
    [QR_KEY.VERSION]: QR_BUNDLER_VERSION.V1,
    ...overrides,
  } satisfies TQRMetadata;
}

export function mockQRBundle(overrides?: Partial<TQRBundle>): TQRBundle {
  return 'mock-base64-bundle-data' as TQRBundle;
}

export function mockQR<T>(payload: T, overrides?: Partial<TQR<T>>): TQR<T> {
  return {
    [QR_KEY.METADATA]: mockQRMetadata(),
    [QR_KEY.PAYLOAD]: payload,
    ...overrides,
  } satisfies TQR<T>;
}

export function mockQRChunk(overrides?: Partial<TQRChunk>): TQRChunk {
  return {
    [QR_KEY.BUNDLE_ID]: 'test-bundle-id',
    [QR_KEY.CHUNK_INDEX]: 1,
    [QR_KEY.CHUNK_TOTAL]: 1,
    [QR_KEY.CHUNK_DATA]: 'mock-chunk-data',
    ...overrides,
  } satisfies TQRChunk;
}

export function mockQRChunks(count: number = 1): TQRChunk[] {
  return Array.from({ length: count }, (_, index) =>
    mockQRChunk({
      [QR_KEY.CHUNK_INDEX]: index + 1,
      [QR_KEY.CHUNK_TOTAL]: count,
      [QR_KEY.CHUNK_DATA]: `mock-chunk-data-${index + 1}`,
    })
  );
}
