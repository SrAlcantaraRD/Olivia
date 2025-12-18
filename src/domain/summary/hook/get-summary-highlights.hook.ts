import { useCallback } from 'react';

import type { TLoggerPort } from '@/domain/core/adapter/logger.adapter';
import type {
  IHookResponse,
  IUseHook,
} from '@/domain/core/interface/hook.interface';
import type { INotifyPort } from '@/domain/core/port/notify.port';
import type { TSummaryHighlight } from '@/domain/summary/entity/summary-highlight.entity';
import type { ISummaryHighlightPort } from '@/domain/summary/port/summary-highlight.port';
import { GetSummaryHighlightsUseCase } from '@/domain/summary/use-case/get-summary-highlights.use-case';
import { useListStore } from '@/domain/core/stores/list.store';

export function useGetSummaryHighlights(adapters: {
  loggerAdapter: TLoggerPort;
  summaryHighlightAdapter: ISummaryHighlightPort;
  notifyAdapter: INotifyPort;
}): IUseHook<void, TSummaryHighlight[]> {
  const {
    actions: { saveItems, getItems, isLoading, startLoading, stopLoading },
  } = useListStore<TSummaryHighlight>('summary-highlights');

  const { loggerAdapter, summaryHighlightAdapter, notifyAdapter } = adapters;

  const execute = useCallback(async (): Promise<
    IHookResponse<TSummaryHighlight[]>
  > => {
    startLoading();
    try {
      const useCase = new GetSummaryHighlightsUseCase({
        loggerAdapter,
        summaryHighlightAdapter,
      });

      const response = await useCase.execute();

      if (!response.success || !response.details) {
        notifyAdapter.error({
          title: 'hook.get-summary-highlights.error',
          description: response.message,
        });
        return { success: false };
      }

      saveItems(response.details.items);

      return { success: true, data: response.details.items };
    } catch (error) {
      loggerAdapter.error('useGetSummaryHighlights.execute', error);
      return { success: false };
    } finally {
      stopLoading();
    }
  }, [loggerAdapter, summaryHighlightAdapter, notifyAdapter]);

  return {
    execute,
    isExecuting: isLoading(),
    items: getItems() ?? [],
  };
}
