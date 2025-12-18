/// <reference types="jest" />

import { act, renderHook } from '@testing-library/react-native';

import type { IHookResponse } from '@/domain/core/interface/hook.interface';
import { useGetRecordTrend } from '@/domain/module/hook/get-record-trend.hook';
import { mockLoggerPort, mockNotifyPort } from '@/tests/mocks/core.port.mock';
import { mockRecordPort } from '@/tests/mocks/module-field.port.mock';

type TRequestGetRecordTrend = {
  startDate?: Date;
  endDate?: Date;
  moduleID?: number;
};

describe('[Hook] - GetRecordTrend', () => {
  const prepareSuiteCase = () => {
    // Arrange
    const loggerAdapter = mockLoggerPort();
    const recordAdapter = mockRecordPort();
    const notifyAdapter = mockNotifyPort();

    const adapters = { loggerAdapter, recordAdapter, notifyAdapter };

    const { result } = renderHook(() => useGetRecordTrend(adapters));

    const execute = async (data: TRequestGetRecordTrend) => {
      let response: IHookResponse<{ day: string; count: number }[]> | undefined;

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
    it('fetches record trend series successfully when useCase succeeds', async () => {
      const { execute, recordAdapter } = prepareSuiteCase();
      const series = [
        { day: '2025-12-08', count: 2 },
        { day: '2025-12-09', count: 1 },
      ];
      recordAdapter.getCountsByDay.mockResolvedValue(series);

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
      expect(response.data).toEqual(series);
      expect(recordAdapter.getCountsByDay).toHaveBeenCalled();
    });
  });
});
