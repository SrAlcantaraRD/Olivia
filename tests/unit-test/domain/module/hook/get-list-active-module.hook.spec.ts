/// <reference types="jest" />

import { act, renderHook } from '@testing-library/react-native';

import type { IHookResponse } from '@/domain/core/interface/hook.interface';
import type { TModule } from '@/domain/module/entity/module.entity';
import { useGetListActiveModule } from '@/domain/module/hook/get-list-active-module.hook';
import { mockLoggerPort, mockNotifyPort } from '@/tests/mocks/core.port.mock';
import { mockModuleEntity } from '@/tests/mocks/module.entity.mock';
import { mockModulePort } from '@/tests/mocks/module.port.mock';

describe('[Hook] - GetListActiveModule', () => {
  const prepareSuiteCase = () => {
    // Arrange
    const loggerAdapter = mockLoggerPort();
    const moduleAdapter = mockModulePort();
    const notifyAdapter = mockNotifyPort();

    const adapters = { loggerAdapter, moduleAdapter, notifyAdapter };

    const { result } = renderHook(() => useGetListActiveModule(adapters));

    const execute = async () => {
      let response: IHookResponse<TModule[]> | undefined;

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

  beforeEach(() => jest.clearAllMocks());

  describe('Happy Path', () => {
    it('fetches active modules successfully when useCase succeeds', async () => {
      const { execute, moduleAdapter } = prepareSuiteCase();
      const activeModule = mockModuleEntity({ id: 1, isActive: true });
      const inactiveModule = mockModuleEntity({ id: 2, isActive: false });
      const modules = [activeModule, inactiveModule];
      moduleAdapter.getAll.mockResolvedValue(modules);

      // Act
      const response = await execute();

      // Assert
      expect(response.success).toBe(true);
      if (!response.success) {
        throw new Error('Expected success hook response');
      }
      expect(response.data).toEqual([activeModule]);
      expect(moduleAdapter.getAll).toHaveBeenCalled();
    });
  });
});
