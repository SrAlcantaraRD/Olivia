import { useCallback } from 'react';

import type { TLoggerPort } from '@/domain/core/adapter/logger.adapter';
import type {
  IHookResponse,
  IUseHook,
} from '@/domain/core/interface/hook.interface';
import type { INotifyPort } from '@/domain/core/port/notify.port';
import { useListStore } from '@/domain/core/stores/list.store';
import type { Ti18nKeys } from '@/domain/core/types/i18n.types';
import type { TSummaryTrend } from '@/domain/summary/entity/summary-trend.entity';
import type { ISummaryTrendPort } from '@/domain/summary/port/summary-trend.port';
import { GetSummaryTrendsUseCase } from '@/domain/summary/use-case/get-summary-trends.use-case';

export function useGetSummaryTrends(adapters: {
  loggerAdapter: TLoggerPort;
  summaryTrendAdapter: ISummaryTrendPort;
  notifyAdapter: INotifyPort;
}): IUseHook<void, TSummaryTrend[]> {
  const {
    actions: { saveItems, getItems, isLoading, startLoading, stopLoading },
  } = useListStore<TSummaryTrend>('summary-trends');

  const { loggerAdapter, summaryTrendAdapter, notifyAdapter } = adapters;

  const execute = useCallback(async (): Promise<
    IHookResponse<TSummaryTrend[]>
  > => {
    startLoading();
    try {
      const useCase = new GetSummaryTrendsUseCase({
        loggerAdapter,
        summaryTrendAdapter,
      });

      const response = await useCase.execute();

      if (!response.success || !response.details) {
        notifyAdapter.error({
          title: 'hook.get-summary-trends.error' as Ti18nKeys,
          description: response.message,
        });
        return { success: false };
      }

      saveItems(response.details.items);

      return { success: true, data: response.details.items };
    } catch (error) {
      loggerAdapter.error('useGetSummaryTrends.execute', error);
      return { success: false };
    } finally {
      stopLoading();
    }
  }, [loggerAdapter, summaryTrendAdapter, notifyAdapter]);

  return {
    execute,
    isExecuting: isLoading(),
    items: getItems() ?? [],
  };
}
