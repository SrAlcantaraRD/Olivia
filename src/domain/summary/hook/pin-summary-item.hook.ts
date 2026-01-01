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
import { PinSummaryItemUseCase } from '@/domain/summary/use-case/pin-summary-item.use-case';
import type { TRequestPinSummaryItem } from '@/domain/summary/use-case-schema/pin-summary-item.use-case-schema';

export function usePinSummaryItem(adapters: {
  loggerAdapter: TLoggerPort;
  summaryPinsAdapter: ISummaryPinsPort;
  notifyAdapter: INotifyPort;
}): IUseHook<TRequestPinSummaryItem, TSummaryPin[]> {
  const {
    actions: { saveItems, getItems, isLoading, startLoading, stopLoading },
  } = useListStore<TSummaryPin>('summary-pins');

  const { loggerAdapter, summaryPinsAdapter, notifyAdapter } = adapters;

  const execute = useCallback(
    async (
      data: TRequestPinSummaryItem
    ): Promise<IHookResponse<TSummaryPin[]>> => {
      startLoading();
      try {
        const useCase = new PinSummaryItemUseCase({
          loggerAdapter,
          summaryPinsAdapter,
        });

        const response = await useCase.execute(data);

        if (!response.success || !response.details) {
          notifyAdapter.error({
            title: 'hook.pin-summary-item.error',
            description: response.message,
          });
          return { success: false };
        }

        saveItems(response.details.pins);

        return { success: true, data: response.details.pins };
      } catch (error) {
        loggerAdapter.error('usePinSummaryItem.execute', error);
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
