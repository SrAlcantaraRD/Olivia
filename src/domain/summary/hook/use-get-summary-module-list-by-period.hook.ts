import { useCallback } from 'react';

import type { TLoggerPort } from '@/domain/core/adapter/logger.adapter';
import type {
  IHookResponse,
  IUseHook,
} from '@/domain/core/interface/hook.interface';
import type { ICachePort } from '@/domain/core/port/cache.port';
import type { INotifyPort } from '@/domain/core/port/notify.port';
import { useListStore } from '@/domain/core/stores/list.store';
import type { IModuleFieldPort } from '@/domain/module/port/module-field.port';
import type { IModulePort } from '@/domain/module/port/module.port';
import type { IRecordFieldPort } from '@/domain/module/port/record-field.port';
import type { IRecordPort } from '@/domain/module/port/record.port';
import type { TSummaryModule } from '@/domain/summary/entity/summary-module.entity';
import type { ISummaryModulePort } from '@/domain/summary/port/summary-module.port';
import type {
  TRequestGetSummaryModuleListByPeriod,
  TResponseGetSummaryModuleListByPeriod,
} from '@/domain/summary/use-case-schema/get-summary-module-list-by-period.use-case-schema';
import { GetSummaryModuleListByPeriodUseCase } from '@/domain/summary/use-case/get-summary-module-list-by-period.use-case';

/**
 * Hook for getting multiple modules summary (for home screen)
 * Autonomous hook that directly consumes the use-case
 */
export const useGetSummaryModuleListByPeriod = (params: {
  loggerAdapter: TLoggerPort;
  notifyAdapter: INotifyPort;
  moduleAdapter: IModulePort;
  moduleFieldAdapter: IModuleFieldPort;
  recordAdapter: IRecordPort;
  recordFieldAdapter: IRecordFieldPort;
  cacheAdapter: ICachePort;
  summaryAdapter: ISummaryModulePort;
}): IUseHook<
  TRequestGetSummaryModuleListByPeriod,
  TResponseGetSummaryModuleListByPeriod
> => {
  const {
    loggerAdapter,
    notifyAdapter,
    cacheAdapter,
    summaryAdapter,
    moduleAdapter,
    moduleFieldAdapter,
    recordAdapter,
    recordFieldAdapter,
  } = params;

  const {
    actions: { startLoading, stopLoading, saveItems, getItems },
  } = useListStore<TSummaryModule>('summary-module');

  const execute = useCallback(
    async (
      data: TRequestGetSummaryModuleListByPeriod
    ): Promise<IHookResponse<TResponseGetSummaryModuleListByPeriod>> => {
      try {
        startLoading();

        const useCase = new GetSummaryModuleListByPeriodUseCase({
          loggerAdapter,
          cacheAdapter,
          summaryAdapter,
          moduleAdapter,
          moduleFieldAdapter,
          recordAdapter,
          recordFieldAdapter,
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
