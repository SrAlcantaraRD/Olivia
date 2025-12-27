import { useCallback } from 'react';

import type { TLoggerPort } from '@/domain/core/adapter/logger.adapter';
import type {
  IHookResponse,
  IUseHook,
} from '@/domain/core/interface/hook.interface';
import type { INotifyPort } from '@/domain/core/port/notify.port';
import { useListStore } from '@/domain/core/stores/list.store';
import type { TSummaryModule } from '@/domain/summary/entity/summary-module.entity';
import type { ISummaryModulePort } from '@/domain/summary/port/summary-module.port';
import type { TRequestGetSummaryModules } from '@/domain/summary/use-case-schema/get-summary-modules.use-case-schema';
import { GetSummaryModulesUseCase } from '@/domain/summary/use-case/get-summary-modules.use-case';

export function useGetSummaryModules(adapters: {
  loggerAdapter: TLoggerPort;
  summaryModuleAdapter: ISummaryModulePort;
  notifyAdapter: INotifyPort;
}): IUseHook<TRequestGetSummaryModules, TSummaryModule[]> {
  const {
    actions: { saveItems, getItems, isLoading, startLoading, stopLoading },
  } = useListStore<TSummaryModule>('summary-modules');

  const { loggerAdapter, summaryModuleAdapter, notifyAdapter } = adapters;

  const execute = useCallback(
    async (
      data: TRequestGetSummaryModules
    ): Promise<IHookResponse<TSummaryModule[]>> => {
      startLoading();
      try {
        const useCase = new GetSummaryModulesUseCase({
          loggerAdapter,
          summaryModuleAdapter,
        });

        const response = await useCase.execute(data);

        if (!response.success || !response.details) {
          notifyAdapter.error({
            title: 'hook.get-summary-modules.error',
            description: response.message,
          });
          return { success: false };
        }

        saveItems(response.details.items);

        return { success: true, data: response.details.items };
      } catch (error) {
        loggerAdapter.error('useGetSummaryModules.execute', error);
        return { success: false };
      } finally {
        stopLoading();
      }
    },
    [loggerAdapter, summaryModuleAdapter, notifyAdapter]
  );

  return {
    execute,
    isExecuting: isLoading(),
    items: getItems() ?? [],
  };
}
