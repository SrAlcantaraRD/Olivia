/// <reference types="jest" />

import { act, renderHook } from '@testing-library/react-native';

import { useGetRecentRecords } from '@/domain/module/hook/get-recent-records.hook';
import { mockLoggerPort, mockNotifyPort } from '@/tests/mocks/core.port.mock';
import { mockRecordPort } from '@/tests/mocks/module-field.port.mock';

describe('[Hook] - GetRecentRecords', () => {
  const prepareSuiteCase = () => {
    // Arrange
    const loggerAdapter = mockLoggerPort();
    const recordAdapter = mockRecordPort();
    const notifyAdapter = mockNotifyPort();
    return { loggerAdapter, recordAdapter, notifyAdapter };
  };

  beforeEach(() => jest.clearAllMocks());

  describe('Happy Path', () => {
    it('fetches recent records successfully when adapter succeeds', async () => {
      const { loggerAdapter, recordAdapter, notifyAdapter } =
        prepareSuiteCase();
      const records = [
        { id: 1, data: {}, synced: true },
        { id: 2, data: {}, synced: false },
      ];
      recordAdapter.getRecentRecords.mockResolvedValue(records);

      // Act
      const { result } = renderHook(() =>
        useGetRecentRecords({
          loggerAdapter,
          recordAdapter,
          notifyAdapter,
        })
      );

      let response;
      await act(async () => {
        response = await result.current.execute(10);
      });

      // Assert
      expect(response.success).toBe(true);
      expect(response.data).toEqual(records);
      expect(recordAdapter.getRecentRecords).toHaveBeenCalledWith(10);
    });
  });
});
