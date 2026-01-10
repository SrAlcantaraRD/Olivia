/// <reference types="jest" />

import { act, renderHook } from '@testing-library/react-native';

import type { IHookResponse } from '@/domain/core/interface/hook.interface';
import type { TRecordCreate } from '@/domain/module/entity/record.entity';
import { useCreateRecord } from '@/domain/module/hook/create-record.hook';
import {
  mockCachePort,
  mockLoggerPort,
  mockNotifyPort,
} from '@/tests/mocks/core.port.mock';
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
    const loggerAdapter = mockLoggerPort();
    const recordAdapter = mockRecordPort();
    const recordFieldAdapter = mockRecordFieldPort();
    const notifyAdapter = mockNotifyPort();
    const cacheAdapter = mockCachePort();

    const adapters = {
      loggerAdapter,
      recordAdapter,
      recordFieldAdapter,
      notifyAdapter,
      cacheAdapter,
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
      const {
        execute,
        recordAdapter,
        recordFieldAdapter,
        cacheAdapter,
        notifyAdapter,
      } = prepareSuiteCase();
      const record = mockRecordEntity({ id: 1 });
      cacheAdapter.get.mockResolvedValue(2);
      recordAdapter.upsert.mockResolvedValue(record);
      recordFieldAdapter.batchUpsert.mockResolvedValue([]);

      const response = await execute(
        mockRecordCreate({
          moduleID: 1,
          synchronized: false,
          data: record.data,
          recordFieldList: [],
        })
      );

      expect(response.success).toBe(true);
      expect(recordAdapter.upsert).toHaveBeenCalled();
      expect(notifyAdapter.success).toHaveBeenCalled();
    });
  });
});
