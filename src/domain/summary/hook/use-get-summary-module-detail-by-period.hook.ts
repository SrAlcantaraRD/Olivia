import { useCallback, useEffect, useState } from 'react';

import type { TLoggerPort } from '@/domain/core/adapter/logger.adapter';
import type {
  IHookResponse,
  IUseHook,
} from '@/domain/core/interface/hook.interface';
import type { ICachePort } from '@/domain/core/port/cache.port';
import type { INotifyPort } from '@/domain/core/port/notify.port';
import {
  type StoreEntryID,
  useByIDStore,
} from '@/domain/core/stores/by-id.store';
import {
  BASE_SUMMARY_MODULE,
  type TSummaryModule,
} from '@/domain/summary/entity/summary-module.entity';
import type { ISummaryModulePort } from '@/domain/summary/port/summary-module.port';
import type { ISummaryModuleFieldPort } from '@/domain/summary/port/summary-module-field.port';
import { GetSummaryModuleDetailByPeriodUseCase } from '@/domain/summary/use-case/get-summary-module-detail-by-period.use-case';
import type {
  TRequestGetSummaryModuleDetailByPeriod,
  TResponseGetSummaryModuleDetailByPeriod,
} from '@/domain/summary/use-case-schema/get-summary-module-detail-by-period.use-case-schema';

export const useGetSummaryModuleDetailByPeriod = (params: {
  loggerAdapter: TLoggerPort;
  notifyAdapter: INotifyPort;
  cacheAdapter: ICachePort;
  summaryModuleAdapter: ISummaryModulePort;
  summaryModuleFieldAdapter: ISummaryModuleFieldPort;
}): IUseHook<
  TRequestGetSummaryModuleDetailByPeriod,
  TResponseGetSummaryModuleDetailByPeriod
> => {
  const {
    loggerAdapter,
    notifyAdapter,
    cacheAdapter,
    summaryModuleAdapter,
    summaryModuleFieldAdapter,
  } = params;
  const [item, setItem] = useState<TSummaryModule>(BASE_SUMMARY_MODULE);
  const [currentModuleID, setCurrentModuleID] = useState<StoreEntryID>('');

  const {
    actions: {
      startLoading,
      stopLoading,
      saveItem,
      getItem,
      isLoading,
      wasLoaded,
    },
  } = useByIDStore<TSummaryModule>('summary-module');

  const execute = useCallback(
    async (
      data: TRequestGetSummaryModuleDetailByPeriod,
      reload = false
    ): Promise<IHookResponse<TResponseGetSummaryModuleDetailByPeriod>> => {
      const { moduleID, period } = data;
      const entryKey = `${moduleID}::${period}`;

      setCurrentModuleID(entryKey);

      const cachedItem = getItem(entryKey);

      if (wasLoaded(entryKey) && cachedItem && !reload) {
        setItem(cachedItem);

        return { success: true, data: cachedItem };
      }

      try {
        startLoading(entryKey);

        const useCase = new GetSummaryModuleDetailByPeriodUseCase({
          loggerAdapter,
          cacheAdapter,
          summaryModuleAdapter,
          summaryModuleFieldAdapter,
        });

        const response = await useCase.execute(data);

        if (!response.success) {
          notifyAdapter.error({
            title: 'hook.create-record.error-title',
            description: response.message,
          });

          return { success: false };
        }

        saveItem(entryKey, response.details);
        setItem(response.details);

        return { success: true, data: response.details };
      } catch (err) {
        const errorObj = err instanceof Error ? err : new Error(String(err));

        loggerAdapter.error('useGetSummaryModuleDetailByPeriod', errorObj);

        notifyAdapter.error({
          title: 'common.error',
          description: 'common.error',
        });
      } finally {
        stopLoading(entryKey);
      }

      return { success: false };
    },
    [
      cacheAdapter,
      loggerAdapter,
      notifyAdapter,
      saveItem,
      startLoading,
      stopLoading,
      summaryModuleAdapter,
      summaryModuleFieldAdapter,
      getItem,
      wasLoaded,
    ]
  );

  useEffect(() => {
    if (!currentModuleID) {
      return;
    }

    const storedItem = getItem(currentModuleID);

    if (storedItem) {
      setItem(storedItem);
    }
  }, [currentModuleID, getItem]);

  return {
    execute,
    isExecuting: isLoading(currentModuleID),
    items: item,
  };
};
