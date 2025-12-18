/// <reference types="jest" />

import { act, renderHook } from '@testing-library/react-native';

import { useGetRecordStatistics } from '@/domain/module/hook/get-record-statistics.hook';
import { mockLoggerPort, mockNotifyPort } from '@/tests/mocks/core.port.mock';
import { mockRecordPort } from '@/tests/mocks/module-field.port.mock';

describe('[Hook] - GetRecordStatistics', () => {
  const prepareSuiteCase = () => {
    // Arrange
    const loggerAdapter = mockLoggerPort();
    const recordAdapter = mockRecordPort();
    const notifyAdapter = mockNotifyPort();
    return { loggerAdapter, recordAdapter, notifyAdapter };
  };

  beforeEach(() => jest.clearAllMocks());

  describe('Happy Path', () => {
    it('fetches record statistics successfully when useCase succeeds', async () => {
      const { loggerAdapter, recordAdapter, notifyAdapter } =
        prepareSuiteCase();
      const stats = {
        countsByModule: [
          { moduleID: 1, count: 3 },
          { moduleID: 2, count: 2 },
        ],
      };
      recordAdapter.getCountsByModule.mockResolvedValue(stats.countsByModule);

      // Act
      const { result } = renderHook(() =>
        useGetRecordStatistics({
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
      expect(response.data).toEqual(stats);
      expect(recordAdapter.getCountsByModule).toHaveBeenCalled();
    });
  });
});
