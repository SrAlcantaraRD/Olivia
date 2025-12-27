import { useCallback } from 'react';

import type { TLoggerPort } from '@/domain/core/adapter/logger.adapter';
import type {
  IHookResponse,
  IUseHook,
} from '@/domain/core/interface/hook.interface';
import type { INotifyPort } from '@/domain/core/port/notify.port';
import { useListStore } from '@/domain/core/stores/list.store';
import type { TSummaryPin } from '@/domain/summary/entity/summary-pin.entity';
import type { ISummaryPinsPort } from '@/domain/summary/port/summary-pins.port';
import { GetSummaryPinsUseCase } from '@/domain/summary/use-case/get-summary-pins.use-case';

export function useGetSummaryPins(adapters: {
  loggerAdapter: TLoggerPort;
  summaryPinsAdapter: ISummaryPinsPort;
  notifyAdapter: INotifyPort;
}): IUseHook<void, TSummaryPin[]> {
  const {
    actions: { saveItems, getItems, isLoading, startLoading, stopLoading },
  } = useListStore<TSummaryPin>('summary-pins');

  const { loggerAdapter, summaryPinsAdapter, notifyAdapter } = adapters;

  const execute = useCallback(async (): Promise<
    IHookResponse<TSummaryPin[]>
  > => {
    startLoading();
    try {
      const useCase = new GetSummaryPinsUseCase({
        loggerAdapter,
        summaryPinsAdapter,
      });

      const response = await useCase.execute();

      if (!response.success || !response.details) {
        notifyAdapter.error({
          title: 'hook.get-summary-pins.error',
          description: response.message,
        });
        return { success: false };
      }

      saveItems(response.details.items);

      return { success: true, data: response.details.items };
    } catch (error) {
      loggerAdapter.error('useGetSummaryPins.execute', error);
      return { success: false };
    } finally {
      stopLoading();
    }
  }, [loggerAdapter, summaryPinsAdapter, notifyAdapter]);

  return {
    execute,
    isExecuting: isLoading(),
    items: getItems() ?? [],
  };
}
