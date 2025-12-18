/// <reference types="jest" />

import { act, renderHook } from '@testing-library/react-native';

import { useGetRecordTrend } from '@/domain/module/hook/get-record-trend.hook';
import { mockLoggerPort, mockNotifyPort } from '@/tests/mocks/core.port.mock';
import { mockRecordPort } from '@/tests/mocks/module-field.port.mock';

describe('[Hook] - GetRecordTrend', () => {
  const prepareSuiteCase = () => {
    // Arrange
    const loggerAdapter = mockLoggerPort();
    const recordAdapter = mockRecordPort();
    const notifyAdapter = mockNotifyPort();
    return { loggerAdapter, recordAdapter, notifyAdapter };
  };

  beforeEach(() => jest.clearAllMocks());

  describe('Happy Path', () => {
    it('fetches record trend series successfully when useCase succeeds', async () => {
      const { loggerAdapter, recordAdapter, notifyAdapter } =
        prepareSuiteCase();
      const series = [
        { day: '2025-12-08', count: 2 },
        { day: '2025-12-09', count: 1 },
      ];
      recordAdapter.getCountsByDay.mockResolvedValue(series);

      // Act
      const { result } = renderHook(() =>
        useGetRecordTrend({
          loggerAdapter,
          recordAdapter,
          notifyAdapter,
        })
      );

      let response;
      await act(async () => {
        response = await result.current.execute({
          startDate: new Date(0),
          endDate: new Date(),
        });
      });

      // Assert
      expect(response.success).toBe(true);
      expect(response.data).toEqual(series);
      expect(recordAdapter.getCountsByDay).toHaveBeenCalled();
    });
  });
});
