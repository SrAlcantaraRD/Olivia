/// <reference types="jest" />

import { act, renderHook } from '@testing-library/react-native';

import type { IHookResponse } from '@/domain/core/interface/hook.interface';
import { useListStore } from '@/domain/core/stores/list.store';
import {
  TRequestModuleListByIDList,
  TResponseModuleListByIDList,
} from '@/domain/module/use-case-schema/get-active-module-list-by-id-list.use-case-schema';
import { useGetModuleListByIDList } from '@/domain/module/hook/get-module-list-by-id-list.hook';
import { mockLoggerPort, mockNotifyPort } from '@/tests/mocks/core.port.mock';
import { mockModuleEntity } from '@/tests/mocks/module.entity.mock';
import { mockModulePort } from '@/tests/mocks/module.port.mock';

describe('[Hook] - GetModuleListByIDList', () => {
  const prepareSuiteCase = () => {
    const loggerAdapter = mockLoggerPort();
    const moduleAdapter = mockModulePort();
    const notifyAdapter = mockNotifyPort();

    const { result } = renderHook(() =>
      useGetModuleListByIDList({ loggerAdapter, moduleAdapter, notifyAdapter })
    );

    const execute = async (
      data: TRequestModuleListByIDList
    ): Promise<IHookResponse<TResponseModuleListByIDList>> => {
      let response: IHookResponse<TResponseModuleListByIDList> | undefined;

      await act(async () => {
        response = await result.current.execute(data);
      });

      if (!response) {
        throw new Error('Expected hook response');
      }

      return response;
    };

    return { result, execute, loggerAdapter, moduleAdapter, notifyAdapter };
  };

  beforeEach(() => {
    jest.clearAllMocks();
    const { result, unmount } = renderHook(() =>
      useListStore('module-list-by-id-list')
    );

    act(() => {
      result.current.actions.clearStore();
    });

    unmount();
  });

  it('stores the filtered modules when the use case succeeds', async () => {
    const { execute, moduleAdapter, result } = prepareSuiteCase();
    const firstModule = mockModuleEntity({ id: 1 });
    const secondModule = mockModuleEntity({ id: 2 });
    const modules = [firstModule, secondModule];
    moduleAdapter.getAll.mockResolvedValue(modules);

    const response = await execute({ idList: [firstModule.id] });

    expect(response.success).toBe(true);
    if (!response.success) {
      throw new Error('Expected success hook response');
    }

    expect(response.data.items).toEqual([firstModule]);
    expect(result.current.items.items).toEqual([firstModule]);
    expect(moduleAdapter.getAll).toHaveBeenCalled();
  });

  it('returns failure and logs when the adapter throws', async () => {
    const { execute, moduleAdapter, loggerAdapter, notifyAdapter } =
      prepareSuiteCase();
    const error = new Error('boom');
    moduleAdapter.getAll.mockRejectedValue(error);

    const response = await execute({ idList: [] });

    expect(response.success).toBe(false);
    expect(loggerAdapter.error).toHaveBeenCalledWith(
      'useGetModuleListByIDList.execute',
      error
    );
    expect(notifyAdapter.error).not.toHaveBeenCalled();
  });
});
