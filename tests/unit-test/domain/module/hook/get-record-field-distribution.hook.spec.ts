/// <reference types="jest" />

import { act, renderHook } from '@testing-library/react-native';

import type { IHookResponse } from '@/domain/core/interface/hook.interface';
import { useGetRecordFieldDistribution } from '@/domain/module/hook/get-record-field-distribution.hook';
import {
  mockCachePort,
  mockLoggerPort,
  mockNotifyPort,
} from '@/tests/mocks/core.port.mock';
import { mockRecordPort } from '@/tests/mocks/module-field.port.mock';

type TRequestGetRecordFieldDistribution = {
  fieldID: number;
  moduleID?: number;
  startDate?: Date;
  endDate?: Date;
};

describe('[Hook] - GetRecordFieldDistribution', () => {
  const prepareSuiteCase = () => {
    // Arrange
    const loggerAdapter = mockLoggerPort();
    const recordAdapter = mockRecordPort();
    const notifyAdapter = mockNotifyPort();
    const cacheAdapter = mockCachePort();

    const adapters = {
      loggerAdapter,
      recordAdapter,
      notifyAdapter,
      cacheAdapter,
    };

    const { result } = renderHook(() =>
      useGetRecordFieldDistribution(adapters)
    );

    const execute = async (data: TRequestGetRecordFieldDistribution) => {
      let response:
        | IHookResponse<{ value: string; count: number }[]>
        | undefined;

      await act(async () => {
        response = await result.current.execute(data);
      });

      if (!response) {
        throw new Error('Expected hook response');
      }

      return response;
    };

    return { result, execute, ...adapters };
  };

  beforeEach(() => jest.clearAllMocks());

  describe('Happy Path', () => {
    it('fetches field distribution successfully when useCase succeeds', async () => {
      const { execute, recordAdapter, cacheAdapter } = prepareSuiteCase();
      const values = [
        { value: 'value1', count: 3 },
        { value: 'value2', count: 1 },
      ];
      recordAdapter.getFieldDistribution.mockResolvedValue(values);
      cacheAdapter.get.mockResolvedValue(null); // no cache

      // Act
      const response = await execute({ fieldID: 1 });

      // Assert
      expect(response.success).toBe(true);
      if (!response.success) {
        throw new Error('Expected success hook response');
      }
      expect(response.data).toEqual(values);
      expect(recordAdapter.getFieldDistribution).toHaveBeenCalledWith({
        fieldID: 1,
      });
    });
  });
});
