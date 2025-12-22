/// <reference types="jest" />

import { act, renderHook } from '@testing-library/react-native';

import type { IHookResponse } from '@/domain/core/interface/hook.interface';
import { useGetRecordStatistics } from '@/domain/module/hook/get-record-statistics.hook';
import type { TResponseRecordStatistics } from '@/domain/module/use-case/get-record-statistics.use-case';
import { mockLoggerPort, mockNotifyPort } from '@/tests/mocks/core.port.mock';
import { mockRecordPort } from '@/tests/mocks/module-field.port.mock';

type TRequestGetRecordStatistics = {
  startDate?: Date;
  endDate?: Date;
};

describe('[Hook] - GetRecordStatistics', () => {
  const prepareSuiteCase = () => {
    // Arrange
    const loggerAdapter = mockLoggerPort();
    const recordAdapter = mockRecordPort();
    const notifyAdapter = mockNotifyPort();

    const adapters = { loggerAdapter, recordAdapter, notifyAdapter };

    const { result } = renderHook(() => useGetRecordStatistics(adapters));

    const execute = async (data: TRequestGetRecordStatistics) => {
      let response: IHookResponse<TResponseRecordStatistics> | undefined;

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
    it('fetches record statistics successfully when useCase succeeds', async () => {
      const { execute, recordAdapter } = prepareSuiteCase();
      const stats = {
        countsByModule: [
          { moduleID: 1, count: 3 },
          { moduleID: 2, count: 2 },
        ],
      };
      recordAdapter.getCountsByModule.mockResolvedValue(stats.countsByModule);

      // Act
      const response = await execute({
        startDate: new Date(0),
        endDate: new Date(),
      });

      // Assert
      expect(response.success).toBe(true);
      if (!response.success) {
        throw new Error('Expected success hook response');
      }
      expect(response.data).toEqual(stats);
      expect(recordAdapter.getCountsByModule).toHaveBeenCalled();
    });
  });
});
