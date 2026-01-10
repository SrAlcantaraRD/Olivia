import { describe, expect, it } from '@jest/globals';
import { act, renderHook } from '@testing-library/react-native';

import { useGenerateRecordSynchronizationQr } from '@/domain/core/hook/use-generate-record-synchronization-qr.hook';
import {
  mockLoggerPort,
  mockNotifyPort,
  mockQRPort,
  mockRecordPort,
} from '@/tests/mocks';

describe('[Hook] - UseGenerateRecordSynchronizationQr', () => {
  const prepareSuiteCase = () => {
    // Arrange
    const loggerAdapter = mockLoggerPort();
    const notifyAdapter = mockNotifyPort();
    const recordAdapter = mockRecordPort();
    const qrAdapter = mockQRPort();

    const adapters = {
      loggerAdapter,
      notifyAdapter,
      recordAdapter,
      qrAdapter,
    };

    const { result } = renderHook(() =>
      useGenerateRecordSynchronizationQr(adapters)
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
      adapters.recordAdapter.getAllByCarerId = jest.fn().mockResolvedValue([]);
      adapters.qrAdapter.packBundle = jest
        .fn()
        .mockResolvedValue('mock-qr-bundle');

      const request = {
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
      adapters.recordAdapter.getAllByCarerId = jest
        .fn()
        .mockRejectedValue(new Error('Record fetch failed'));

      const request = {
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
