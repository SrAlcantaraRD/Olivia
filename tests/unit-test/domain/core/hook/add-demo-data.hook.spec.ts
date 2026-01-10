import { describe, expect, it } from '@jest/globals';
import { act, renderHook } from '@testing-library/react-native';

import { useAddDemoData } from '@/domain/core/hook/add-demo-data.hook';
import {
  mockCarerPort,
  mockLoggerPort,
  mockModuleFieldPort,
  mockModulePort,
  mockNotifyPort,
  mockRecordFieldPort,
  mockRecordPort,
} from '@/tests/mocks';

describe('[Hook] - UseAddDemoData', () => {
  const prepareSuiteCase = () => {
    // Arrange
    const loggerAdapter = mockLoggerPort();
    const notifyAdapter = mockNotifyPort();
    const carerAdapter = mockCarerPort();
    const moduleAdapter = mockModulePort();
    const moduleFieldAdapter = mockModuleFieldPort();
    const recordAdapter = mockRecordPort();
    const recordFieldAdapter = mockRecordFieldPort();

    const adapters = {
      loggerAdapter,
      notifyAdapter,
      carerAdapter,
      moduleAdapter,
      moduleFieldAdapter,
      recordAdapter,
      recordFieldAdapter,
    };

    const { result } = renderHook(() => useAddDemoData(adapters));

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
      expect(result.current.items).toBeUndefined();
      expect(typeof result.current.execute).toBe('function');
    });
  });

  describe('Execute function', () => {
    it('should execute successfully when adapters resolve', async () => {
      const { result, adapters } = prepareSuiteCase();

      // Mock successful execution
      adapters.carerAdapter.create = jest.fn().mockResolvedValue({ id: 1 });
      adapters.moduleAdapter.batchActivate = jest.fn().mockResolvedValue([]);
      adapters.moduleFieldAdapter.batchActivate = jest
        .fn()
        .mockResolvedValue([]);
      adapters.recordAdapter.batchCreate = jest.fn().mockResolvedValue([]);
      adapters.recordFieldAdapter.batchCreate = jest.fn().mockResolvedValue([]);

      const request = {
        carerID: 1,
      };

      await act(async () => {
        await result.current.execute(request);
      });

      expect(result.current.isExecuting).toBe(false);
      expect(result.current.items).toBeUndefined();
    });

    it('should handle execution errors gracefully', async () => {
      const { result, adapters } = prepareSuiteCase();

      // Mock error during execution
      adapters.carerAdapter.create = jest
        .fn()
        .mockRejectedValue(new Error('Carer creation failed'));

      const request = {
        carerID: 1,
      };

      await act(async () => {
        await result.current.execute(request);
      });

      expect(result.current.isExecuting).toBe(false);
      expect(result.current.items).toBeUndefined();
      expect(adapters.loggerAdapter.error).toHaveBeenCalled();
      expect(adapters.notifyAdapter.error).toHaveBeenCalled();
    });
  });
});
