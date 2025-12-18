/// <reference types="jest" />

import { act, renderHook } from '@testing-library/react-native';

import type { TBaseEntity } from '@/domain/core/entity/base-entity.entity';
import { useGetEntityList } from '@/domain/core/hooks/get-entity-list.hook';
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

    return { hook: result.current, ...adapters };
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Happy Path', () => {
    it('fetches entities successfully when adapter returns data', async () => {
      const { hook, mockAdapter } = prepareSuiteCase();
      const items: MockEntity[] = [{ id: 1, name: 'Test' }];
      mockAdapter.getAll.mockResolvedValue(items);

      // Act
      let response;
      await act(async () => {
        response = await hook.execute();
      });

      // Assert
      expect(response.success).toBe(true);
      expect(response.data).toEqual(items);
      expect(mockAdapter.getAll).toHaveBeenCalled();
    });
  });
});
