/// <reference types="jest" />

import { act, renderHook } from '@testing-library/react-native';

import { useGetListActiveModule } from '@/domain/module/hook/get-list-active-module.hook';
import { mockLoggerPort, mockNotifyPort } from '@/tests/mocks/core.port.mock';
import { mockModulePort } from '@/tests/mocks/module.port.mock';

describe('[Hook] - GetListActiveModule', () => {
  const prepareSuiteCase = () => {
    // Arrange
    const loggerAdapter = mockLoggerPort();
    const moduleAdapter = mockModulePort();
    const notifyAdapter = mockNotifyPort();
    return { loggerAdapter, moduleAdapter, notifyAdapter };
  };

  beforeEach(() => jest.clearAllMocks());

  describe('Happy Path', () => {
    it('fetches active modules successfully when useCase succeeds', async () => {
      const { loggerAdapter, moduleAdapter, notifyAdapter } =
        prepareSuiteCase();
      const modules = [
        { id: '1', name: 'Module1', isActive: true },
        { id: '2', name: 'Module2', isActive: false },
      ];
      moduleAdapter.getAll.mockResolvedValue(modules);

      // Act
      const { result } = renderHook(() =>
        useGetListActiveModule({
          loggerAdapter,
          moduleAdapter,
          notifyAdapter,
        })
      );

      let response;
      await act(async () => {
        response = await result.current.execute();
      });

      // Assert
      expect(response.success).toBe(true);
      expect(response.data).toEqual([
        { id: '1', name: 'Module1', isActive: true },
      ]);
      expect(moduleAdapter.getAll).toHaveBeenCalled();
    });
  });
});
