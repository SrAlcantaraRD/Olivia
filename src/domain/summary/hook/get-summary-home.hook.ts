import { useCallback } from 'react';

import type { TLoggerPort } from '@/domain/core/adapter/logger.adapter';
import type {
  IHookResponse,
  IUseHook,
} from '@/domain/core/interface/hook.interface';
import type { INotifyPort } from '@/domain/core/port/notify.port';
import { useListStore } from '@/domain/core/stores/list.store';
import type { TSummaryModule } from '@/domain/summary/entity/summary-module.entity';
import type { TSummaryPin } from '@/domain/summary/entity/summary-pin.entity';
import type { ISummaryModulePort } from '@/domain/summary/port/summary-module.port';
import type { ISummaryPinsPort } from '@/domain/summary/port/summary-pins.port';
import { GetSummaryHomeUseCase } from '@/domain/summary/use-case/get-summary-home.use-case';
import type { TRequestGetSummaryHome } from '@/domain/summary/use-case-schema/get-summary-home.use-case-schema';

type TSummaryHomeData = {
  modules: TSummaryModule[];
  pins: TSummaryPin[];
};

export function useGetSummaryHome(adapters: {
  loggerAdapter: TLoggerPort;
  summaryModuleAdapter: ISummaryModulePort;
  summaryPinsAdapter: ISummaryPinsPort;
  notifyAdapter: INotifyPort;
}): IUseHook<TRequestGetSummaryHome, TSummaryHomeData> {
  const {
    actions: { saveItems, getItems, isLoading, startLoading, stopLoading },
  } = useListStore<TSummaryHomeData>('summary-home');

  const {
    loggerAdapter,
    summaryModuleAdapter,
    summaryPinsAdapter,
    notifyAdapter,
  } = adapters;

  const execute = useCallback(
    async (
      data: TRequestGetSummaryHome
    ): Promise<IHookResponse<TSummaryHomeData>> => {
      startLoading();
      try {
        const useCase = new GetSummaryHomeUseCase({
          loggerAdapter,
          summaryModuleAdapter,
          summaryPinsAdapter,
        });

        const response = await useCase.execute(data);

        if (!response.success || !response.details) {
          notifyAdapter.error({
            title: 'hook.get-summary-home.error',
            description: response.message,
          });
          return { success: false };
        }

        saveItems([response.details]);

        return { success: true, data: response.details };
      } catch (error) {
        loggerAdapter.error('useGetSummaryHome.execute', error);
        return { success: false };
      } finally {
        stopLoading();
      }
    },
    [loggerAdapter, summaryModuleAdapter, summaryPinsAdapter, notifyAdapter]
  );

  const items = getItems()[0] ?? { modules: [], pins: [] };

  return {
    execute,
    isExecuting: isLoading(),
    items,
  };
}
