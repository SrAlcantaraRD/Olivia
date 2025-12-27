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
import type { TRequestUnpinSummaryItem } from '@/domain/summary/use-case-schema/unpin-summary-item.use-case-schema';
import { UnpinSummaryItemUseCase } from '@/domain/summary/use-case/unpin-summary-item.use-case';

export function useUnpinSummaryItem(adapters: {
  loggerAdapter: TLoggerPort;
  summaryPinsAdapter: ISummaryPinsPort;
  notifyAdapter: INotifyPort;
}): IUseHook<TRequestUnpinSummaryItem, TSummaryPin[]> {
  const {
    actions: { saveItems, getItems, isLoading, startLoading, stopLoading },
  } = useListStore<TSummaryPin>('summary-pins');

  const { loggerAdapter, summaryPinsAdapter, notifyAdapter } = adapters;

  const execute = useCallback(
    async (
      data: TRequestUnpinSummaryItem
    ): Promise<IHookResponse<TSummaryPin[]>> => {
      startLoading();
      try {
        const useCase = new UnpinSummaryItemUseCase({
          loggerAdapter,
          summaryPinsAdapter,
        });

        const response = await useCase.execute(data);

        if (!response.success || !response.details) {
          notifyAdapter.error({
            title: 'hook.unpin-summary-item.error',
            description: response.message,
          });
          return { success: false };
        }

        saveItems(response.details.pins);

        return { success: true, data: response.details.pins };
      } catch (error) {
        loggerAdapter.error('useUnpinSummaryItem.execute', error);
        return { success: false };
      } finally {
        stopLoading();
      }
    },
    [loggerAdapter, summaryPinsAdapter, notifyAdapter]
  );

  return {
    execute,
    isExecuting: isLoading(),
    items: getItems() ?? [],
  };
}
