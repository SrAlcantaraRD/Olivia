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
import { GetActiveModuleListUseCase } from '@/domain/module/use-case/get-active-module-list.use-case';
import type { TRequestGetActiveModuleList } from '@/domain/module/use-case-schema/get-active-module-list.use-case-schema';

export function useGetListActiveModule(adapters: {
  loggerAdapter: TLoggerPort;
  moduleAdapter: IModulePort;
  notifyAdapter: INotifyPort;
}): IUseHook<void, TModule[]> {
  const {
    actions: { saveItems, getItems, isLoading, startLoading, stopLoading },
  } = useListStore<TModule>('module');

  const { loggerAdapter, moduleAdapter, notifyAdapter } = adapters;

  const execute = useCallback(
    async (
      _data: TRequestGetActiveModuleList
    ): Promise<IHookResponse<TModule[]>> => {
      startLoading();

      try {
        const useCase = new GetActiveModuleListUseCase({
          loggerAdapter,
          moduleAdapter,
        });

        const response = await useCase.execute();

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
          data: response.details.items,
        };
      } catch (error) {
        loggerAdapter.error('useGetListActiveModule.execute', error);

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
    items: getItems() ?? [],
  };
}
