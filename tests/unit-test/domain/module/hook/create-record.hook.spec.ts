/// <reference types="jest" />

import { act, renderHook } from '@testing-library/react-native';

import type { IHookResponse } from '@/domain/core/interface/hook.interface';
import type { TRecordCreate } from '@/domain/module/entity/record.entity';
import { useCreateRecord } from '@/domain/module/hook/create-record.hook';
import { mockLoggerPort, mockNotifyPort } from '@/tests/mocks/core.port.mock';
import {
  mockRecordCreate,
  mockRecordEntity,
} from '@/tests/mocks/module-field.entity.mock';
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

    const adapters = {
      loggerAdapter,
      recordAdapter,
      recordFieldAdapter,
      notifyAdapter,
    };

    const { result } = renderHook(() => useCreateRecord(adapters));

    const execute = async (data: TRecordCreate) => {
      let response: IHookResponse<void> | undefined;

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
    it('creates record successfully when useCase succeeds', async () => {
      const { execute, recordAdapter, recordFieldAdapter, notifyAdapter } =
        prepareSuiteCase();
      const record = mockRecordEntity({ id: 1 });
      recordAdapter.create.mockResolvedValue(record);
      recordFieldAdapter.batchCreate.mockResolvedValue([]);

      // Act
      const response = await execute(
        mockRecordCreate({
          moduleID: 1,
          synchronized: false,
          data: record.data,
          fieldList: [],
        })
      );

      // Assert
      expect(response.success).toBe(true);
      expect(recordAdapter.create).toHaveBeenCalled();
      expect(notifyAdapter.success).toHaveBeenCalled();
    });
  });
});
