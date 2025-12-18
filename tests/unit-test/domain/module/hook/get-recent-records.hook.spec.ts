/// <reference types="jest" />

import { act, renderHook } from '@testing-library/react-native';

import type { IHookResponse } from '@/domain/core/interface/hook.interface';
import type { TRecord } from '@/domain/module/entity/record.entity';
import { useGetRecentRecords } from '@/domain/module/hook/get-recent-records.hook';
import { mockLoggerPort, mockNotifyPort } from '@/tests/mocks/core.port.mock';
import { mockRecordEntity } from '@/tests/mocks/module-field.entity.mock';
import { mockRecordPort } from '@/tests/mocks/module-field.port.mock';

describe('[Hook] - GetRecentRecords', () => {
  const prepareSuiteCase = () => {
    // Arrange
    const loggerAdapter = mockLoggerPort();
    const recordAdapter = mockRecordPort();
    const notifyAdapter = mockNotifyPort();

    const adapters = { loggerAdapter, recordAdapter, notifyAdapter };

    const { result } = renderHook(() => useGetRecentRecords(adapters));

    const execute = async (limit?: number) => {
      let response: IHookResponse<TRecord[]> | undefined;

      await act(async () => {
        response = await result.current.execute(limit ?? 10);
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
    it('fetches recent records successfully when adapter succeeds', async () => {
      const { execute, recordAdapter } = prepareSuiteCase();
      const records = [
        mockRecordEntity({ id: 1, synced: true }),
        mockRecordEntity({ id: 2, synced: false }),
      ];
      recordAdapter.getRecentRecords.mockResolvedValue(records);

      // Act
      const response = await execute(10);

      // Assert
      expect(response.success).toBe(true);
      if (!response.success) {
        throw new Error('Expected success hook response');
      }
      expect(response.data).toEqual(records);
      expect(recordAdapter.getRecentRecords).toHaveBeenCalledWith(10);
    });
  });
});
