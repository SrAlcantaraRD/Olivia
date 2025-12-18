/// <reference types="jest" />

import { act, renderHook } from '@testing-library/react-native';

import type { IHookResponse } from '@/domain/core/interface/hook.interface';
import type { TModuleField } from '@/domain/module/entity/module-field.entity';
import { useGetListModuleField } from '@/domain/module/hook/get-list-module-field.hook';
import type { TRequestGetModuleFieldList } from '@/domain/module/use-case-schema/get-module-field-list.use-case-schema';
import { mockLoggerPort, mockNotifyPort } from '@/tests/mocks/core.port.mock';
import { mockModuleFieldEntity } from '@/tests/mocks/module-field.entity.mock';
import { mockModuleFieldPort } from '@/tests/mocks/module-field.port.mock';

describe('[Hook] - GetListModuleField', () => {
  const prepareSuiteCase = () => {
    // Arrange
    const loggerAdapter = mockLoggerPort();
    const moduleFieldAdapter = mockModuleFieldPort();
    const notifyAdapter = mockNotifyPort();

    const adapters = { loggerAdapter, moduleFieldAdapter, notifyAdapter };

    const { result } = renderHook(() => useGetListModuleField(adapters));

    const execute = async (data: TRequestGetModuleFieldList) => {
      let response: IHookResponse<TModuleField[]> | undefined;

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
    it('fetches module fields successfully when useCase succeeds', async () => {
      const { execute, moduleFieldAdapter } = prepareSuiteCase();
      const moduleID = 123;
      const fields = [
        mockModuleFieldEntity({ id: 1, moduleId: moduleID, title: 'Field1' }),
        mockModuleFieldEntity({ id: 2, moduleId: moduleID, title: 'Field2' }),
      ];
      moduleFieldAdapter.getAllByModuleId.mockResolvedValue(fields);

      // Act
      const response = await execute({ moduleID });

      // Assert
      expect(response.success).toBe(true);
      if (!response.success) {
        throw new Error('Expected success hook response');
      }
      expect(response.data).toEqual(fields);
      expect(moduleFieldAdapter.getAllByModuleId).toHaveBeenCalledWith(
        moduleID
      );
    });
  });
});
