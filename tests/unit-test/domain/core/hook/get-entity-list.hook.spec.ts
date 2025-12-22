/// <reference types="jest" />

import { act, renderHook } from '@testing-library/react-native';

import type { TBaseEntity } from '@/domain/core/entity/base-entity.entity';
import { STATUS_ENUM } from '@/domain/core/enum/status.enum';
import { useGetEntityList } from '@/domain/core/hook/get-entity-list.hook';
import type { IHookResponse } from '@/domain/core/interface/hook.interface';
import { mockNotifyPort } from '@/tests/mocks/core.port.mock';

interface MockEntity extends TBaseEntity {
  name: string;
}

describe('[Hook] - GetEntityList', () => {
  const prepareSuiteCase = () => {
    const notifyAdapter = mockNotifyPort();

    const mockAdapter = {
      getAll: jest.fn(),
    };

    const adapters = { notifyAdapter, mockAdapter };

    const { result } = renderHook(() =>
      useGetEntityList<MockEntity>(
        'test-entity',
        adapters.notifyAdapter,
        adapters.mockAdapter
      )
    );

    const execute = async () => {
      let response: IHookResponse<MockEntity[]> | undefined;

      await act(async () => {
        response = await result.current.execute();
      });

      if (!response) {
        throw new Error('Expected hook response');
      }

      return response;
    };

    return { result, execute, ...adapters };
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Happy Path', () => {
    it('fetches entities successfully when adapter returns data', async () => {
      const { execute, mockAdapter } = prepareSuiteCase();
      const items: MockEntity[] = [
        {
          id: 1,
          name: 'Test',
          status: STATUS_ENUM.ACTIVE,
          createdAt: new Date('2026-01-01T00:00:00.000Z'),
        },
      ];
      mockAdapter.getAll.mockResolvedValue(items);

      // Act
      const response = await execute();

      // Assert
      expect(response.success).toBe(true);
      if (!response.success) {
        throw new Error('Expected success hook response');
      }
      expect(response.data).toEqual(items);
      expect(mockAdapter.getAll).toHaveBeenCalled();
    });
  });
});
