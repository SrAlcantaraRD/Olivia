/// <reference types="jest" />

import { describe, expect, it } from '@jest/globals';

import type { TLoggerPort } from '@/domain/core/adapter/logger.adapter';
import { QR_KEY } from '@/domain/core/enum/qr-key.enum';
import type { IBaseResponse } from '@/domain/core/interface/base-response.interface';
import type { IQRPort } from '@/domain/core/port/qr.port';
import { WorkWithQRBaseUseCase } from '@/domain/module/abstract/work-with-qr.use-case-abstract';
import {
  mockLoggerPort,
  mockQRChunk,
  mockQRPort,
  mockRecord,
  mockRecordFieldEntity,
} from '@/tests/mocks';

// Concrete implementation for testing the abstract class
class TestWorkWithQRUseCase extends WorkWithQRBaseUseCase<
  { test: string },
  { result: string }
> {
  constructor(qrAdapter: IQRPort, loggerAdapter: TLoggerPort) {
    super('test-work-with-qr', qrAdapter, loggerAdapter);
  }

  public async execute(_request: {
    test: string;
  }): Promise<IBaseResponse<{ result: string }>> {
    // Not implemented for this test
    throw new Error('Method not implemented.');
  }
}

describe('[Abstract] - WorkWithQRBaseUseCase', () => {
  const prepareSuiteCase = () => {
    const qrAdapter = mockQRPort();
    const loggerAdapter = mockLoggerPort();

    const usecase = new TestWorkWithQRUseCase(qrAdapter, loggerAdapter);

    return {
      usecase,
      qrAdapter,
      loggerAdapter,
    };
  };

  beforeEach(() => jest.clearAllMocks());

  describe('fromChunks', () => {
    it('should throw error when called with empty chunks array', async () => {
      const { usecase, loggerAdapter } = prepareSuiteCase();

      await expect(usecase.fromChunks([])).rejects.toThrow('no chunks');

      expect(loggerAdapter.error).toHaveBeenCalledWith({
        message: 'fromChunks called with no chunks',
        useCase: 'test-work-with-qr',
        details: undefined,
      });
    });

    it('should throw error when chunks are incomplete', async () => {
      const { usecase, loggerAdapter } = prepareSuiteCase();

      const incompleteChunks = [
        mockQRChunk({
          [QR_KEY.CHUNK_INDEX]: 1,
          [QR_KEY.CHUNK_TOTAL]: 3, // Total is 3 but only 1 chunk provided
        }),
      ];

      await expect(usecase.fromChunks(incompleteChunks)).rejects.toThrow(
        'missing chunks'
      );

      expect(loggerAdapter.error).toHaveBeenCalledWith({
        message:
          'fromQRChunks called with incomplete chunks: expected "3", got "1"',
        useCase: 'test-work-with-qr',
        details: undefined,
      });
    });

    it('should sort chunks by index and assemble correctly', async () => {
      const { usecase, qrAdapter } = prepareSuiteCase();

      // Create chunks out of order
      const chunk1 = mockQRChunk({
        [QR_KEY.CHUNK_INDEX]: 3,
        [QR_KEY.CHUNK_TOTAL]: 3,
        [QR_KEY.CHUNK_DATA]: 'chunk3',
      });

      const chunk2 = mockQRChunk({
        [QR_KEY.CHUNK_INDEX]: 1,
        [QR_KEY.CHUNK_TOTAL]: 3,
        [QR_KEY.CHUNK_DATA]: 'chunk1',
      });

      const chunk3 = mockQRChunk({
        [QR_KEY.CHUNK_INDEX]: 2,
        [QR_KEY.CHUNK_TOTAL]: 3,
        [QR_KEY.CHUNK_DATA]: 'chunk2',
      });

      const chunks = [chunk1, chunk2, chunk3]; // Out of order

      const mockBundle = { [QR_KEY.PAYLOAD]: { test: 'data' } };
      qrAdapter.unpackBundle.mockResolvedValue(mockBundle);

      const result = await usecase.fromChunks(chunks);

      // Verify chunks were sorted correctly (1, 2, 3)
      expect(qrAdapter.unpackBundle).toHaveBeenCalledWith('chunk1chunk2chunk3');
      expect(result).toEqual(mockBundle);
    });

    it('should handle single chunk correctly', async () => {
      const { usecase, qrAdapter } = prepareSuiteCase();

      const singleChunk = mockQRChunk({
        [QR_KEY.CHUNK_INDEX]: 1,
        [QR_KEY.CHUNK_TOTAL]: 1,
        [QR_KEY.CHUNK_DATA]: 'single-chunk-data',
      });

      const mockBundle = { [QR_KEY.PAYLOAD]: { test: 'single' } };
      qrAdapter.unpackBundle.mockResolvedValue(mockBundle);

      const result = await usecase.fromChunks([singleChunk]);

      expect(qrAdapter.unpackBundle).toHaveBeenCalledWith('single-chunk-data');
      expect(result).toEqual(mockBundle);
    });
  });

  describe('toChunks', () => {
    it('should pack bundle and create chunks correctly', async () => {
      const { usecase, qrAdapter } = prepareSuiteCase();

      const testData = { test: 'payload' };
      const qrBundle = {
        [QR_KEY.METADATA]: {
          [QR_KEY.VERSION]: '1',
        },
        [QR_KEY.PAYLOAD]: testData,
      };
      const mockBundle = 'base64-encoded-bundle';
      qrAdapter.packBundle.mockResolvedValue(mockBundle);

      // Mock chunkBase64 to return 2 chunks
      usecase.chunkBase64 = jest.fn().mockReturnValue(['chunk1', 'chunk2']);

      const result = await usecase.toChunks(qrBundle);

      expect(qrAdapter.packBundle).toHaveBeenCalledWith({
        [QR_KEY.METADATA]: {
          [QR_KEY.VERSION]: '1',
        },
        [QR_KEY.PAYLOAD]: testData,
      });

      expect(usecase.chunkBase64).toHaveBeenCalledWith(mockBundle, 800); // Default QR_CHUNK_SIZE

      expect(result).toEqual([
        {
          [QR_KEY.BUNDLE_ID]: 'base', // First 4 chars of bundle
          [QR_KEY.CHUNK_INDEX]: 1,
          [QR_KEY.CHUNK_TOTAL]: 2,
          [QR_KEY.CHUNK_DATA]: 'chunk1',
        },
        {
          [QR_KEY.BUNDLE_ID]: 'base',
          [QR_KEY.CHUNK_INDEX]: 2,
          [QR_KEY.CHUNK_TOTAL]: 2,
          [QR_KEY.CHUNK_DATA]: 'chunk2',
        },
      ]);
    });
  });

  describe('generateQRCode', () => {
    it('should generate QR code structure with metadata and payload', () => {
      const { usecase } = prepareSuiteCase();

      const testPayload = { test: 'data' };
      const result = usecase.generateQRCode(testPayload);

      expect(result).toEqual({
        [QR_KEY.METADATA]: {
          [QR_KEY.VERSION]: '1',
        },
        [QR_KEY.PAYLOAD]: testPayload,
      });
    });
  });

  describe('mapRecordToRecordSync', () => {
    it('should map record entity to record sync structure', () => {
      const { usecase } = prepareSuiteCase();

      const record = mockRecord({
        moduleID: 'test-module-id',
        createdAt: new Date('2024-01-01T10:00:00Z'),
        recordFieldList: [
          mockRecordFieldEntity({
            fieldID: 'field-1',
            value: 'value1',
          }),
          mockRecordFieldEntity({
            fieldID: 'field-2',
            value: 'value2',
          }),
        ],
      });

      const result = usecase.mapRecordToRecordSync(record);

      expect(result).toEqual({
        [QR_KEY.RECORD_MODULE_ID]: 'test-module-id',
        [QR_KEY.RECORD_DATE]: '1704103200000', // 2024-01-01T08:00:00Z timestamp (local timezone)
        [QR_KEY.RECORD_FIELDS]: [
          {
            [QR_KEY.RECORD_FIELD_ID]: 'field-1',
            [QR_KEY.RECORD_FIELD_VALUE]: 'value1',
          },
          {
            [QR_KEY.RECORD_FIELD_ID]: 'field-2',
            [QR_KEY.RECORD_FIELD_VALUE]: 'value2',
          },
        ],
      });
    });

    it('should handle record without recordFieldList', () => {
      const { usecase } = prepareSuiteCase();

      const record = mockRecord({
        moduleID: 'test-module-id',
        recordFieldList: undefined,
      });

      const result = usecase.mapRecordToRecordSync(record);

      expect(result[QR_KEY.RECORD_FIELDS]).toEqual([]);
    });
  });

  describe('mapRecordFieldToRecordFieldSync', () => {
    it('should map record field entity to record field sync structure', () => {
      const { usecase } = prepareSuiteCase();

      const recordField = mockRecordFieldEntity({
        fieldID: 'test-field-id',
        value: 'test-value',
      });

      const result = usecase.mapRecordFieldToRecordFieldSync(recordField);

      expect(result).toEqual({
        [QR_KEY.RECORD_FIELD_ID]: 'test-field-id',
        [QR_KEY.RECORD_FIELD_VALUE]: 'test-value',
      });
    });
  });

  describe('chunkBase64', () => {
    it('should split base64 string into chunks of specified size', () => {
      const { usecase } = prepareSuiteCase();

      const base64 = 'abcdefghij'; // 10 characters
      const result = usecase.chunkBase64(base64, 3);

      expect(result).toEqual(['abc', 'def', 'ghi', 'j']);
    });

    it('should use default chunk size when not specified', () => {
      const { usecase } = prepareSuiteCase();

      const base64 = 'a'.repeat(6000); // Long string
      const result = usecase.chunkBase64(base64);

      // Should create chunks of default size (800)
      expect(result.length).toBeGreaterThan(1);
      expect(result[0].length).toBe(800);
    });
  });

  describe('assembleChunks', () => {
    it('should join chunks back into single string', () => {
      const { usecase } = prepareSuiteCase();

      const chunks = ['chunk1', 'chunk2', 'chunk3'];
      const result = usecase.assembleChunks(chunks);

      expect(result).toBe('chunk1chunk2chunk3');
    });

    it('should handle empty chunks array', () => {
      const { usecase } = prepareSuiteCase();

      const result = usecase.assembleChunks([]);

      expect(result).toBe('');
    });
  });
});
