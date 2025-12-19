import { useCallback } from 'react';

import type { TLoggerPort } from '@/domain/core/adapter/logger.adapter';
import type {
  IHookResponse,
  IUseHook,
} from '@/domain/core/interface/hook.interface';
import type { INotifyPort } from '@/domain/core/port/notify.port';
import { useListStore } from '@/domain/core/stores/list.store';
import type { Ti18nKeys } from '@/domain/core/types/i18n.types';
import type { TSummaryPin } from '@/domain/summary/entity/summary-pin.entity';
import type { ISummaryPinsPort } from '@/domain/summary/port/summary-pins.port';
import { ReorderSummaryPinsUseCase } from '@/domain/summary/use-case/reorder-summary-pins.use-case';
import type { TRequestReorderSummaryPins } from '@/domain/summary/use-case-schema/reorder-summary-pins.use-case-schema';

export function useReorderSummaryPins(adapters: {
  loggerAdapter: TLoggerPort;
  summaryPinsAdapter: ISummaryPinsPort;
  notifyAdapter: INotifyPort;
}): IUseHook<TRequestReorderSummaryPins, TSummaryPin[]> {
  const {
    actions: { saveItems, getItems, isLoading, startLoading, stopLoading },
  } = useListStore<TSummaryPin>('summary-pins');

  const { loggerAdapter, summaryPinsAdapter, notifyAdapter } = adapters;

  const execute = useCallback(
    async (
      data: TRequestReorderSummaryPins
    ): Promise<IHookResponse<TSummaryPin[]>> => {
      startLoading();
      try {
        const useCase = new ReorderSummaryPinsUseCase({
          loggerAdapter,
          summaryPinsAdapter,
        });

        const response = await useCase.execute(data);

        if (!response.success || !response.details) {
          notifyAdapter.error({
            title: 'hook.reorder-summary-pins.error' as Ti18nKeys,
            description: response.message,
          });
          return { success: false };
        }

        saveItems(response.details.pins);

        return { success: true, data: response.details.pins };
      } catch (error) {
        loggerAdapter.error('useReorderSummaryPins.execute', error);
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
