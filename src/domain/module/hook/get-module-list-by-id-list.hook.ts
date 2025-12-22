import { useCallback } from 'react';

import type { TLoggerPort } from '@/domain/core/adapter/logger.adapter';
import type {
  IHookResponse,
  IUseHook,
} from '@/domain/core/interface/hook.interface';
import type { INotifyPort } from '@/domain/core/port/notify.port';
import { useListStore } from '@/domain/core/stores/list.store';
import type { TModule } from '@/domain/module/entity/module.entity';
import type { IModulePort } from '@/domain/module/port/module.port';
import { GetModuleListByIDListUseCase } from '@/domain/module/use-case/get-module-list-by-id-list.use-case';
import type {
  TRequestModuleListByIDList,
  TResponseModuleListByIDList,
} from '@/domain/module/use-case-schema/get-active-module-list-by-id-list.use-case-schema';

export function useGetModuleListByIDList(adapters: {
  loggerAdapter: TLoggerPort;
  moduleAdapter: IModulePort;
  notifyAdapter: INotifyPort;
}): IUseHook<TRequestModuleListByIDList, TResponseModuleListByIDList> {
  const {
    actions: { saveItems, getItems, isLoading, startLoading, stopLoading },
  } = useListStore<TModule>('module-list-by-id-list');

  const { loggerAdapter, moduleAdapter, notifyAdapter } = adapters;

  const execute = useCallback(
    async (
      data: TRequestModuleListByIDList
    ): Promise<IHookResponse<TResponseModuleListByIDList>> => {
      startLoading();

      try {
        const useCase = new GetModuleListByIDListUseCase({
          loggerAdapter,
          moduleAdapter,
        });

        const response = await useCase.execute(data);

        if (!response.success) {
          notifyAdapter.error({
            title: 'hook.get-list-active-module.error-title',
            description: response.message,
          });

          return { success: false };
        }

        // Save only the array of items to the store (not the wrapper object)
        saveItems(response.details.items);

        return {
          success: true,
          data: response.details,
        };
      } catch (error) {
        loggerAdapter.error('useGetModuleListByIDList.execute', error);

        return { success: false };
      } finally {
        stopLoading();
      }
    },
    []
  );

  return {
    execute,
    isExecuting: isLoading(),
    items: { items: getItems() ?? [] },
  };
}
