import { describe, expect, it } from '@jest/globals';

import { QR_KEY } from '@/domain/core/enum/qr-key.enum';
import { ConsumeRecordSynchronizationQRUseCase } from '@/domain/core/use-case/consume-record-synchronization-qr.use-case';
import type { TRequestConsumeRecordSynchronizationQR } from '@/domain/core/use-case-schema/consume-record-synchronization-qr.use-case-schema';
import {
  mockLoggerPort,
  mockQRChunk,
  mockQRPort,
  mockRecordFieldPort,
  mockRecordPort,
  mockRecordSyncBundle,
} from '@/tests/mocks';

describe('[UseCase] - ConsumeRecordSynchronizationQR', () => {
  const prepareSuiteCase = () => {
    const recordAdapter = mockRecordPort();
    const recordFieldAdapter = mockRecordFieldPort();
    const qrAdapter = mockQRPort();
    const loggerAdapter = mockLoggerPort();

    const usecase = new ConsumeRecordSynchronizationQRUseCase({
      recordAdapter,
      recordFieldAdapter,
      qrAdapter,
      loggerAdapter,
    });

    return {
      usecase,
      recordAdapter,
      recordFieldAdapter,
      qrAdapter,
      loggerAdapter,
    };
  };

  beforeEach(() => jest.clearAllMocks());

  describe('Input Validation', () => {
    it('should handle invalid request schema with empty chunkList', async () => {
      const { usecase, loggerAdapter } = prepareSuiteCase();

      const payload = {
        chunkList: [], // Invalid: empty array
      } as TRequestConsumeRecordSynchronizationQR;

      const result = await usecase.execute(payload);

      expect(result.success).toBe(false);
      expect(result.message).toBe(
        'use-case.consume-record-synchronization-qr.invalid-request'
      );
      expect(loggerAdapter.error).toHaveBeenCalled();
    });

    it('should handle invalid request schema with missing chunkList', async () => {
      const { usecase, loggerAdapter } = prepareSuiteCase();

      const payload = {} as TRequestConsumeRecordSynchronizationQR; // Invalid: missing chunkList

      const result = await usecase.execute(payload);

      expect(result.success).toBe(false);
      expect(result.message).toBe(
        'use-case.consume-record-synchronization-qr.invalid-request'
      );
      expect(loggerAdapter.error).toHaveBeenCalled();
    });
  });

  describe('Bundle Processing', () => {
    it('should call fromChunks with correct chunkList and handle invalid bundle schema', async () => {
      const { usecase, loggerAdapter } = prepareSuiteCase();

      // Mock fromChunks to return invalid bundle (not a valid RecordSyncBundle)
      const mockFromChunks = jest.fn().mockResolvedValue({
        [QR_KEY.PAYLOAD]: { invalid: 'bundle' }, // Invalid bundle structure
      });
      usecase.fromChunks = mockFromChunks;

      const validRequest = {
        chunkList: [
          mockQRChunk({
            [QR_KEY.CHUNK_TOTAL]: 1,
          }),
        ],
      } satisfies TRequestConsumeRecordSynchronizationQR;

      const result = await usecase.execute(validRequest);

      // Verify fromChunks was called with correct parameters
      expect(mockFromChunks).toHaveBeenCalledWith(validRequest.chunkList);
      expect(mockFromChunks).toHaveBeenCalledTimes(1);

      // Verify error handling for invalid bundle
      expect(result.success).toBe(false);
      expect(result.message).toBe(
        'use-case.consume-record-synchronization-qr.invalid-bundle'
      );
      expect(loggerAdapter.error).toHaveBeenCalled();
    });

    it('should successfully process valid bundle and upsert records with fields', async () => {
      const { usecase, recordAdapter, recordFieldAdapter } = prepareSuiteCase();

      const validBundle = mockRecordSyncBundle();
      const mockFromChunks = jest.fn().mockResolvedValue({
        [QR_KEY.PAYLOAD]: validBundle,
      });
      usecase.fromChunks = mockFromChunks;

      // Mock successful record upsert
      const mockUpsertedRecord = {
        id: 'mock-record-id',
        moduleID: validBundle[QR_KEY.RECORDS][0][QR_KEY.RECORD_MODULE_ID],
        carerID: validBundle[QR_KEY.ORIGIN_CARER_ID],
        synchronized: true,
        createdAt: new Date(
          Number(validBundle[QR_KEY.RECORDS][0][QR_KEY.RECORD_DATE])
        ),
        recordFieldList: [],
      };
      recordAdapter.upsert.mockResolvedValue(mockUpsertedRecord);

      // Mock successful record field batch upsert
      recordFieldAdapter.batchUpsert.mockResolvedValue();

      const validRequest = {
        chunkList: [
          mockQRChunk({
            [QR_KEY.CHUNK_TOTAL]: 1,
          }),
        ],
      } satisfies TRequestConsumeRecordSynchronizationQR;

      const result = await usecase.execute(validRequest);

      // Verify fromChunks was called correctly
      expect(mockFromChunks).toHaveBeenCalledWith(validRequest.chunkList);
      expect(mockFromChunks).toHaveBeenCalledTimes(1);

      // Verify successful processing
      expect(result.success).toBe(true);
      expect(result.message).toBe(
        'use-case.consume-record-synchronization-qr.success'
      );
      expect(result.details).toEqual({
        applied: true,
        appliedCount: validBundle[QR_KEY.RECORDS].length,
      });

      // Verify record upsert was called for each record
      expect(recordAdapter.upsert).toHaveBeenCalledTimes(
        validBundle[QR_KEY.RECORDS].length
      );

      // Verify record field batch upsert was called for each record
      expect(recordFieldAdapter.batchUpsert).toHaveBeenCalledTimes(
        validBundle[QR_KEY.RECORDS].length
      );

      // Verify the structure of upsert calls
      validBundle[QR_KEY.RECORDS].forEach((record, index) => {
        expect(recordAdapter.upsert).toHaveBeenNthCalledWith(index + 1, {
          moduleID: record[QR_KEY.RECORD_MODULE_ID],
          carerID: validBundle[QR_KEY.ORIGIN_CARER_ID],
          synchronized: true,
          createdAt: new Date(Number(record[QR_KEY.RECORD_DATE])),
          recordFieldList: [],
        });
      });
    });

    it('should reject empty records array bundle', async () => {
      const { usecase, recordAdapter, recordFieldAdapter, loggerAdapter } =
        prepareSuiteCase();

      const emptyBundle = mockRecordSyncBundle({
        [QR_KEY.RECORDS]: [], // Empty records array
      });

      const mockFromChunks = jest.fn().mockResolvedValue({
        [QR_KEY.PAYLOAD]: emptyBundle,
      });
      usecase.fromChunks = mockFromChunks;

      const validRequest = {
        chunkList: [
          mockQRChunk({
            [QR_KEY.CHUNK_TOTAL]: 1,
          }),
        ],
      } satisfies TRequestConsumeRecordSynchronizationQR;

      const result = await usecase.execute(validRequest);

      // Verify fromChunks was called correctly
      expect(mockFromChunks).toHaveBeenCalledWith(validRequest.chunkList);

      // Verify invalid-bundle error (schema requires at least one record)
      expect(result.success).toBe(false);
      expect(result.message).toBe(
        'use-case.consume-record-synchronization-qr.invalid-bundle'
      );
      expect(loggerAdapter.error).toHaveBeenCalled();

      // Verify no upsert calls were made
      expect(recordAdapter.upsert).not.toHaveBeenCalled();
      expect(recordFieldAdapter.batchUpsert).not.toHaveBeenCalled();
    });
  });
});
