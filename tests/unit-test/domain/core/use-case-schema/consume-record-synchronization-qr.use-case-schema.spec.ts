import { describe, expect, it } from '@jest/globals';

import { QR_KEY } from '@/domain/core/enum/qr-key.enum';
import {
  RequestConsumeRecordSynchronizationQRSchema,
  ResponseConsumeRecordSynchronizationQRSchema,
  type TRequestConsumeRecordSynchronizationQR,
  type TResponseConsumeRecordSynchronizationQR,
} from '@/domain/core/use-case-schema/consume-record-synchronization-qr.use-case-schema';

describe('[UseCaseSchema] - ConsumeRecordSynchronizationQR', () => {
  describe('RequestConsumeRecordSynchronizationQRSchema', () => {
    it('should parse valid chunk list', () => {
      const validRequest = {
        chunkList: [
          {
            [QR_KEY.BUNDLE_ID]: 'bundle-123',
            [QR_KEY.CHUNK_INDEX]: 1,
            [QR_KEY.CHUNK_TOTAL]: 3,
            [QR_KEY.CHUNK_DATA]: 'data1',
          },
          {
            [QR_KEY.BUNDLE_ID]: 'bundle-123',
            [QR_KEY.CHUNK_INDEX]: 2,
            [QR_KEY.CHUNK_TOTAL]: 3,
            [QR_KEY.CHUNK_DATA]: 'data2',
          },
        ],
      };

      const result =
        RequestConsumeRecordSynchronizationQRSchema.parse(validRequest);
      expect(result.chunkList).toHaveLength(2);
      expect(result.chunkList[0][QR_KEY.BUNDLE_ID]).toBe('bundle-123');
    });

    it('should throw error for empty chunk list', () => {
      expect(() =>
        RequestConsumeRecordSynchronizationQRSchema.parse({ chunkList: [] })
      ).toThrow();
    });

    it('should throw error for invalid chunk structure', () => {
      const invalidRequest = {
        chunkList: [
          {
            [QR_KEY.BUNDLE_ID]: 'bundle-123',
            [QR_KEY.CHUNK_INDEX]: 0, // Invalid: must be >= 1
            [QR_KEY.CHUNK_TOTAL]: 3,
            [QR_KEY.CHUNK_DATA]: 'data1',
          },
        ],
      };

      expect(() =>
        RequestConsumeRecordSynchronizationQRSchema.parse(invalidRequest)
      ).toThrow();
    });

    it('should have correct inferred type', () => {
      const request: TRequestConsumeRecordSynchronizationQR = {
        chunkList: [
          {
            [QR_KEY.BUNDLE_ID]: 'bundle-123',
            [QR_KEY.CHUNK_INDEX]: 1,
            [QR_KEY.CHUNK_TOTAL]: 1,
            [QR_KEY.CHUNK_DATA]: 'data',
          },
        ],
      };
      expect(request.chunkList).toHaveLength(1);
    });
  });

  describe('ResponseConsumeRecordSynchronizationQRSchema', () => {
    it('should parse valid response', () => {
      const validResponse = {
        applied: true,
        appliedCount: 5,
      };

      const result =
        ResponseConsumeRecordSynchronizationQRSchema.parse(validResponse);
      expect(result.applied).toBe(true);
      expect(result.appliedCount).toBe(5);
    });

    it('should throw error for negative appliedCount', () => {
      const invalidResponse = {
        applied: false,
        appliedCount: -1,
      };

      expect(() =>
        ResponseConsumeRecordSynchronizationQRSchema.parse(invalidResponse)
      ).toThrow();
    });

    it('should throw error for non-integer appliedCount', () => {
      const invalidResponse = {
        applied: true,
        appliedCount: 1.5,
      };

      expect(() =>
        ResponseConsumeRecordSynchronizationQRSchema.parse(invalidResponse)
      ).toThrow();
    });

    it('should have correct inferred type', () => {
      const response: TResponseConsumeRecordSynchronizationQR = {
        applied: false,
        appliedCount: 0,
      };
      expect(response.applied).toBe(false);
      expect(response.appliedCount).toBe(0);
    });
  });
});
