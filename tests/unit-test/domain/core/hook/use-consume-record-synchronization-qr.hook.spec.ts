import { describe, expect, it } from '@jest/globals';
import { act, renderHook } from '@testing-library/react-native';

import { useConsumeRecordSynchronizationQr } from '@/domain/core/hook/use-consume-record-synchronization-qr.hook';
import {
  mockLoggerPort,
  mockNotifyPort,
  mockQRPort,
  mockRecordFieldPort,
  mockRecordPort,
} from '@/tests/mocks';

describe('[Hook] - UseConsumeRecordSynchronizationQr', () => {
  const prepareSuiteCase = () => {
    // Arrange
    const loggerAdapter = mockLoggerPort();
    const notifyAdapter = mockNotifyPort();
    const recordAdapter = mockRecordPort();
    const recordFieldAdapter = mockRecordFieldPort();
    const qrAdapter = mockQRPort();

    const adapters = {
      loggerAdapter,
      notifyAdapter,
      recordAdapter,
      recordFieldAdapter,
      qrAdapter,
    };

    const { result } = renderHook(() =>
      useConsumeRecordSynchronizationQr(adapters)
    );

    return {
      result,
      adapters,
    };
  };

  beforeEach(() => jest.clearAllMocks());

  describe('Hook initialization', () => {
    it('should initialize with correct default state', () => {
      const { result } = prepareSuiteCase();

      expect(result.current.isExecuting).toBe(false);
      expect(result.current.items).toBeNull();
      expect(typeof result.current.execute).toBe('function');
    });
  });

  describe('Execute function', () => {
    it('should execute successfully when adapters resolve', async () => {
      const { result, adapters } = prepareSuiteCase();

      // Mock successful execution
      adapters.recordAdapter.batchCreate = jest.fn().mockResolvedValue([]);
      adapters.recordFieldAdapter.batchCreate = jest.fn().mockResolvedValue([]);
      adapters.qrAdapter.unpackBundle = jest.fn().mockResolvedValue({
        records: [],
        modules: [],
        moduleFields: [],
      });

      const request = {
        qrData: 'mock-qr-data',
        carerID: 1,
      };

      await act(async () => {
        await result.current.execute(request);
      });

      expect(result.current.isExecuting).toBe(false);
      expect(result.current.items).toBeDefined();
    });

    it('should handle execution errors gracefully', async () => {
      const { result, adapters } = prepareSuiteCase();

      // Mock error during execution
      adapters.qrAdapter.unpackBundle = jest
        .fn()
        .mockRejectedValue(new Error('QR unpack failed'));

      const request = {
        qrData: 'invalid-qr-data',
        carerID: 1,
      };

      await act(async () => {
        await result.current.execute(request);
      });

      expect(result.current.isExecuting).toBe(false);
      expect(result.current.items).toBeNull();
      expect(adapters.loggerAdapter.error).toHaveBeenCalled();
      expect(adapters.notifyAdapter.error).toHaveBeenCalled();
    });
  });
});
