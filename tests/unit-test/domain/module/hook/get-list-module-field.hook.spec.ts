/// <reference types="jest" />

import { act, renderHook } from '@testing-library/react-native';

import { useGetListModuleField } from '@/domain/module/hook/get-list-module-field.hook';
import { mockLoggerPort, mockNotifyPort } from '@/tests/mocks/core.port.mock';
import { mockModuleFieldPort } from '@/tests/mocks/module-field.port.mock';

describe('[Hook] - GetListModuleField', () => {
  const prepareSuiteCase = () => {
    // Arrange
    const loggerAdapter = mockLoggerPort();
    const moduleFieldAdapter = mockModuleFieldPort();
    const notifyAdapter = mockNotifyPort();
    return { loggerAdapter, moduleFieldAdapter, notifyAdapter };
  };

  beforeEach(() => jest.clearAllMocks());

  describe('Happy Path', () => {
    it('fetches module fields successfully when useCase succeeds', async () => {
      const { loggerAdapter, moduleFieldAdapter, notifyAdapter } =
        prepareSuiteCase();
      const moduleID = 'module-123';
      const fields = [
        { id: 'field1', name: 'Field1', moduleId: moduleID },
        { id: 'field2', name: 'Field2', moduleId: moduleID },
      ];
      moduleFieldAdapter.getAllByModuleId.mockResolvedValue(fields);

      // Act
      const { result } = renderHook(() =>
        useGetListModuleField({
          loggerAdapter,
          moduleFieldAdapter,
          notifyAdapter,
        })
      );

      let response;
      await act(async () => {
        response = await result.current.execute({ moduleID });
      });

      // Assert
      expect(response.success).toBe(true);
      expect(response.data).toEqual(fields);
      expect(moduleFieldAdapter.getAllByModuleId).toHaveBeenCalledWith(
        moduleID
      );
    });
  });
});
