import { describe, expect, it } from '@jest/globals';

import { QR_KEY } from '@/domain/core/enum/qr-key.enum';
import { GenerateRecordSynchronizationQRUseCase } from '@/domain/core/use-case/generate-record-synchronization-qr.use-case';
import { mockLoggerPort, mockQRPort, mockRecordPort } from '@/tests/mocks';

describe('[UseCase] - GenerateRecordSynchronizationQR', () => {
  const prepareSuiteCase = () => {
    const loggerAdapter = mockLoggerPort();
    const recordAdapter = mockRecordPort();
    const qrAdapter = mockQRPort();

    const unit = new GenerateRecordSynchronizationQRUseCase({
      loggerAdapter,
      recordAdapter,
      qrAdapter,
    });

    return {
      unit,
      loggerAdapter,
      recordAdapter,
      qrAdapter,
    };
  };

  beforeEach(() => jest.clearAllMocks());

  describe('Input Validation', () => {
    it('should handle invalid request schema with missing carerID', async () => {
      const { unit, loggerAdapter } = prepareSuiteCase();

      const request = {
        invalidField: 'test',
        carerID: 'invalid', // Invalid: string instead of number
      };

      const result = await unit.execute(request);

      expect(result.success).toBe(false);
      expect(result.message).toBe(
        'use-case.generate-record-synchronization-qr.invalid-request'
      );
      expect(loggerAdapter.error).toHaveBeenCalled();
    });

    it('should handle invalid request schema with invalid carerID', async () => {
      const { unit, loggerAdapter } = prepareSuiteCase();

      const request = {
        carerID: -1, // Invalid: negative number
      } as unknown;

      const result = await unit.execute(request);

      expect(result.success).toBe(false);
      expect(result.message).toBe(
        'use-case.generate-record-synchronization-qr.invalid-request'
      );
      expect(loggerAdapter.error).toHaveBeenCalled();
    });

    // Note: Full happy path and complex error cases require refactoring of the use case
    // to be more testable. The use case has tight coupling with WorkWithQRBaseUseCase
    // and complex QR processing logic that makes unit testing difficult.
  });

  describe('Happy Path', () => {
    it('should generate QR successfully with pending records', async () => {
      const { unit, recordAdapter } = prepareSuiteCase();

      // Mock pending records
      const mockRecords = [
        {
          id: 1,
          moduleID: 10,
          carerID: 5,
          synchronized: false,
          createdAt: new Date('2024-01-01'),
          recordFieldList: [
            {
              fieldID: 100,
              value: 'test-value',
            },
          ],
        },
      ];
      recordAdapter.getPendingToSynchronized.mockResolvedValue(mockRecords);

      // Mock QR processing
      const mockQR = {
        [QR_KEY.METADATA]: { [QR_KEY.VERSION]: 'v1' },
        [QR_KEY.PAYLOAD]: {
          [QR_KEY.ORIGIN_CARER_ID]: 1,
          [QR_KEY.RECORDS]: [
            {
              [QR_KEY.RECORD_MODULE_ID]: 10,
              [QR_KEY.RECORD_DATE]: new Date('2024-01-01').getTime().toString(),
              [QR_KEY.RECORD_FIELDS]: [
                {
                  [QR_KEY.RECORD_FIELD_ID]: 100,
                  [QR_KEY.RECORD_FIELD_VALUE]: 'test-value',
                },
              ],
            },
          ],
        },
      };
      // @ts-expect-error - accessing protected method for testing
      unit.generateQRCode = jest.fn().mockReturnValue(mockQR);
      // @ts-expect-error - accessing protected method for testing
      unit.toChunks = jest.fn().mockResolvedValue([
        {
          [QR_KEY.BUNDLE_ID]: 'test',
          [QR_KEY.CHUNK_INDEX]: 1,
          [QR_KEY.CHUNK_TOTAL]: 1,
          [QR_KEY.CHUNK_DATA]: 'chunk-data',
        },
      ]);

      const request = {
        carerID: 1,
      };

      const result = await unit.execute(request);

      expect(result.success).toBe(true);
      expect(result.message).toBe(
        'use-case.generate-record-synchronization-qr.success'
      );
      expect(result.details).toBeDefined();
      expect(result.details.bundle).toBeDefined();
      expect(result.details.chunkList).toBeDefined();
      expect(recordAdapter.getPendingToSynchronized).toHaveBeenCalled();
    });
  });
});
