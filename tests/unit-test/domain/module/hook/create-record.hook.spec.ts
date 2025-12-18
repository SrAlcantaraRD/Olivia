/// <reference types="jest" />

import { act, renderHook } from '@testing-library/react-native';

import { useCreateRecord } from '@/domain/module/hook/create-record.hook';
import { mockLoggerPort, mockNotifyPort } from '@/tests/mocks/core.port.mock';
import {
  mockRecordFieldPort,
  mockRecordPort,
} from '@/tests/mocks/module-field.port.mock';

describe('[Hook] - CreateRecord', () => {
  const prepareSuiteCase = () => {
    // Arrange
    const loggerAdapter = mockLoggerPort();
    const recordAdapter = mockRecordPort();
    const recordFieldAdapter = mockRecordFieldPort();
    const notifyAdapter = mockNotifyPort();
    return { loggerAdapter, recordAdapter, recordFieldAdapter, notifyAdapter };
  };

  beforeEach(() => jest.clearAllMocks());

  describe('Happy Path', () => {
    it('creates record successfully when useCase succeeds', async () => {
      const {
        loggerAdapter,
        recordAdapter,
        recordFieldAdapter,
        notifyAdapter,
      } = prepareSuiteCase();
      const record = { id: 1, data: {}, synced: true };
      recordAdapter.create.mockResolvedValue(record);
      recordFieldAdapter.batchCreate.mockResolvedValue([]);

      // Act
      const { result } = renderHook(() =>
        useCreateRecord({
          loggerAdapter,
          recordAdapter,
          recordFieldAdapter,
          notifyAdapter,
        })
      );

      let response;
      await act(async () => {
        response = await result.current.execute({
          moduleID: 1,
          data: {},
          synced: false,
        });
      });

      // Assert
      expect(response.success).toBe(true);
      expect(recordAdapter.create).toHaveBeenCalled();
      expect(notifyAdapter.success).toHaveBeenCalled();
    });
  });
});
