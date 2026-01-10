import { useCallback } from 'react';

import type { TLoggerPort } from '@/domain/core/adapter/logger.adapter';
import type {
  IHookResponse,
  IUseHook,
} from '@/domain/core/interface/hook.interface';
import type { ICachePort } from '@/domain/core/port/cache.port';
import type { INotifyPort } from '@/domain/core/port/notify.port';
import { useListStore } from '@/domain/core/stores/list.store';
import type { TSummaryModule } from '@/domain/summary/entity/summary-module.entity';
import type { ISummaryModulePort } from '@/domain/summary/port/summary-module.port';
import { GetSummaryModuleListByPeriodUseCase } from '@/domain/summary/use-case/get-summary-module-list-by-period.use-case';
import type {
  TRequestGetSummaryModuleListByPeriod,
  TResponseGetSummaryModuleListByPeriod,
} from '@/domain/summary/use-case-schema/get-summary-module-list-by-period.use-case-schema';

export const useGetSummaryModuleListByPeriod = (params: {
  loggerAdapter: TLoggerPort;
  notifyAdapter: INotifyPort;
  cacheAdapter: ICachePort;
  summaryModuleAdapter: ISummaryModulePort;
}): IUseHook<
  TRequestGetSummaryModuleListByPeriod,
  TResponseGetSummaryModuleListByPeriod
> => {
  const { loggerAdapter, notifyAdapter, cacheAdapter, summaryModuleAdapter } =
    params;

  const {
    actions: { startLoading, stopLoading, saveItems, getItems },
  } = useListStore<TSummaryModule>('summary-module');

  const execute = useCallback(
    async (
      data: TRequestGetSummaryModuleListByPeriod,
      reload = false
    ): Promise<IHookResponse<TResponseGetSummaryModuleListByPeriod>> => {
      try {
        startLoading();

        const useCase = new GetSummaryModuleListByPeriodUseCase({
          loggerAdapter,
          cacheAdapter,
          summaryModuleAdapter,
        });

        const response = await useCase.execute(data);

        if (!response.success) {
          notifyAdapter.error({
            title: 'hook.create-record.error-title',
            description: response.message,
          });

          return { success: false };
        }

        notifyAdapter.success({
          title: 'hook.create-record.success-title',
          description: 'common.success',
        });

        saveItems(response.details);

        return { success: true, data: response.details };
      } catch (err) {
        const errorObj = err instanceof Error ? err : new Error(String(err));

        loggerAdapter.error('useGetSummaryModuleListByPeriod', errorObj);

        notifyAdapter.error({
          title: 'common.error',
          description: 'common.error',
        });
      } finally {
        stopLoading();
      }

      return { success: false };
    },
    []
  );

  return {
    execute,
    isExecuting: false,
    items: getItems(),
  };
};
