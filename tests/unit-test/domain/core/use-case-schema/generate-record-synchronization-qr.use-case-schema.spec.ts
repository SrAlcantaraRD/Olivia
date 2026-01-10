import { describe, expect, it } from '@jest/globals';

import { QR_KEY } from '@/domain/core/enum/qr-key.enum';
import {
  RequestGenerateRecordSynchronizationQRSchema,
  ResponseGenerateRecordSynchronizationQRSchema,
  type TRequestGenerateRecordSynchronizationQR,
  type TResponseGenerateRecordSynchronizationQR,
} from '@/domain/core/use-case-schema/generate-record-synchronization-qr.use-case-schema';

describe('[UseCaseSchema] - GenerateRecordSynchronizationQR', () => {
  describe('RequestGenerateRecordSynchronizationQRSchema', () => {
    it('should parse valid carerID', () => {
      const validRequest = { carerID: 123 };
      const result =
        RequestGenerateRecordSynchronizationQRSchema.parse(validRequest);
      expect(result.carerID).toBe(123);
    });

    it('should throw error for invalid carerID values', () => {
      expect(() =>
        RequestGenerateRecordSynchronizationQRSchema.parse({ carerID: 0 })
      ).toThrow();
      expect(() =>
        RequestGenerateRecordSynchronizationQRSchema.parse({ carerID: -1 })
      ).toThrow();
      expect(() =>
        RequestGenerateRecordSynchronizationQRSchema.parse({ carerID: 1.5 })
      ).toThrow();
      expect(() =>
        RequestGenerateRecordSynchronizationQRSchema.parse({ carerID: '123' })
      ).toThrow();
    });

    it('should use default carerID when not provided', () => {
      const result = RequestGenerateRecordSynchronizationQRSchema.parse({});
      expect(result.carerID).toBe(1);
    });

    it('should have correct inferred type', () => {
      const request: TRequestGenerateRecordSynchronizationQR = { carerID: 456 };
      expect(request.carerID).toBe(456);
    });
  });

  describe('ResponseGenerateRecordSynchronizationQRSchema', () => {
    it('should parse valid response', () => {
      const validResponse = {
        bundle: {
          [QR_KEY.ORIGIN_CARER_ID]: 123,
          [QR_KEY.RECORDS]: [
            {
              [QR_KEY.RECORD_MODULE_ID]: 456,
              [QR_KEY.RECORD_DATE]: '2024-01-01',
              [QR_KEY.RECORD_FIELDS]: [
                {
                  [QR_KEY.RECORD_FIELD_ID]: 789,
                  [QR_KEY.RECORD_FIELD_VALUE]: 'test value',
                },
              ],
            },
          ],
        },
        chunkList: [
          {
            [QR_KEY.BUNDLE_ID]: 'bundle-123',
            [QR_KEY.CHUNK_INDEX]: 1,
            [QR_KEY.CHUNK_TOTAL]: 1,
            [QR_KEY.CHUNK_DATA]: 'data',
          },
        ],
      };

      const result =
        ResponseGenerateRecordSynchronizationQRSchema.parse(validResponse);
      expect(result.bundle[QR_KEY.ORIGIN_CARER_ID]).toBe(123);
      expect(result.chunkList).toHaveLength(1);
    });

    it('should throw error for empty records array', () => {
      const invalidResponse = {
        bundle: {
          [QR_KEY.ORIGIN_CARER_ID]: 123,
          [QR_KEY.RECORDS]: [], // Invalid: must have at least 1 record
        },
        chunkList: [
          {
            [QR_KEY.BUNDLE_ID]: 'bundle-123',
            [QR_KEY.CHUNK_INDEX]: 1,
            [QR_KEY.CHUNK_TOTAL]: 1,
            [QR_KEY.CHUNK_DATA]: 'data',
          },
        ],
      };

      expect(() =>
        ResponseGenerateRecordSynchronizationQRSchema.parse(invalidResponse)
      ).toThrow();
    });

    it('should throw error for empty chunkList', () => {
      const invalidResponse = {
        bundle: {
          [QR_KEY.ORIGIN_CARER_ID]: 123,
          [QR_KEY.RECORDS]: [
            {
              [QR_KEY.RECORD_MODULE_ID]: 456,
              [QR_KEY.RECORD_DATE]: '2024-01-01',
              [QR_KEY.RECORD_FIELDS]: [
                {
                  [QR_KEY.RECORD_FIELD_ID]: 789,
                  [QR_KEY.RECORD_FIELD_VALUE]: 'test value',
                },
              ],
            },
          ],
        },
        chunkList: [], // Invalid: must have at least 1 chunk
      };

      expect(() =>
        ResponseGenerateRecordSynchronizationQRSchema.parse(invalidResponse)
      ).toThrow();
    });

    it('should have correct inferred type', () => {
      const response: TResponseGenerateRecordSynchronizationQR = {
        bundle: {
          [QR_KEY.ORIGIN_CARER_ID]: 123,
          [QR_KEY.RECORDS]: [
            {
              [QR_KEY.RECORD_MODULE_ID]: 456,
              [QR_KEY.RECORD_DATE]: '2024-01-01',
              [QR_KEY.RECORD_FIELDS]: [
                {
                  [QR_KEY.RECORD_FIELD_ID]: 789,
                  [QR_KEY.RECORD_FIELD_VALUE]: 'test value',
                },
              ],
            },
          ],
        },
        chunkList: [
          {
            [QR_KEY.BUNDLE_ID]: 'bundle-123',
            [QR_KEY.CHUNK_INDEX]: 1,
            [QR_KEY.CHUNK_TOTAL]: 1,
            [QR_KEY.CHUNK_DATA]: 'data',
          },
        ],
      };
      expect(response.bundle[QR_KEY.ORIGIN_CARER_ID]).toBe(123);
    });
  });
});
