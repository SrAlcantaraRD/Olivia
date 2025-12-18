/// <reference types="jest" />

import { act, renderHook } from '@testing-library/react-native';

import { useGetRecordFieldDistribution } from '@/domain/module/hook/get-record-field-distribution.hook';
import {
  mockCachePort,
  mockLoggerPort,
  mockNotifyPort,
} from '@/tests/mocks/core.port.mock';
import { mockRecordPort } from '@/tests/mocks/module-field.port.mock';

describe('[Hook] - GetRecordFieldDistribution', () => {
  const prepareSuiteCase = () => {
    // Arrange
    const loggerAdapter = mockLoggerPort();
    const recordAdapter = mockRecordPort();
    const notifyAdapter = mockNotifyPort();
    const cacheAdapter = mockCachePort();

    return { loggerAdapter, recordAdapter, notifyAdapter, cacheAdapter };
  };

  beforeEach(() => jest.clearAllMocks());

  describe('Happy Path', () => {
    it('fetches field distribution successfully when useCase succeeds', async () => {
      const { loggerAdapter, recordAdapter, notifyAdapter, cacheAdapter } =
        prepareSuiteCase();
      const values = [
        { value: 'value1', count: 3 },
        { value: 'value2', count: 1 },
      ];
      recordAdapter.getFieldDistribution.mockResolvedValue(values);
      cacheAdapter.get.mockResolvedValue(null); // no cache

      // Act
      const { result } = renderHook(() =>
        useGetRecordFieldDistribution({
          loggerAdapter,
          recordAdapter,
          notifyAdapter,
          cacheAdapter,
        })
      );

      let response;
      await act(async () => {
        response = await result.current.execute({ fieldID: 1 });
      });

      // Assert
      expect(response.success).toBe(true);
      expect(response.data).toEqual(values);
      expect(recordAdapter.getFieldDistribution).toHaveBeenCalledWith({
        fieldID: 1,
      });
    });
  });
});
