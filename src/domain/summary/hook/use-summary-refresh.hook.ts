import { useCallback } from 'react';

import type { TLoggerPort } from '@/domain/core/adapter/logger.adapter';
import type {
  IHookResponse,
  IUseHook,
} from '@/domain/core/interface/hook.interface';
import type { INotifyPort } from '@/domain/core/port/notify.port';
import { useListStore } from '@/domain/core/stores/list.store';
import type {
  TRequestRefreshSummarySnapshots,
  TResponseRefreshSummarySnapshots,
} from '@/domain/summary/use-case-schema/refresh-summary-snapshots.use-case-schema';
import { RefreshSummarySnapshotsUseCase } from '@/domain/summary/use-case/refresh-summary-snapshots.use-case';

export function useSummaryRefresh(adapters: {
  loggerAdapter: TLoggerPort;
  notifyAdapter: INotifyPort;
}): IUseHook<
  TRequestRefreshSummarySnapshots,
  TResponseRefreshSummarySnapshots
> {
  const {
    actions: { saveItems, getItems, startLoading, stopLoading },
    isLoading,
  } = useListStore<TResponseRefreshSummarySnapshots>('summary-snapshot');

  const { loggerAdapter, notifyAdapter } = adapters;

  const execute = useCallback(
    async (
      data: TRequestRefreshSummarySnapshots
    ): Promise<IHookResponse<TResponseRefreshSummarySnapshots>> => {
      startLoading();
      try {
        const useCase = new RefreshSummarySnapshotsUseCase({
          loggerAdapter,
        });

        const response = await useCase.execute(data);

        if (!response.success || !response.details) {
          notifyAdapter.error({
            title: 'common.error',
            description: response.message,
          });
          return { success: false };
        }

        saveItems([response.details]);

        return { success: true, data: response.details };
      } catch (error) {
        loggerAdapter.error('useRefreshSummarySnapshots.execute', error);
        return { success: false };
      } finally {
        stopLoading();
      }
    },
    []
  );

  const items = getItems()[0] ?? {
    modules: [],
    trends: [],
    highlights: [],
    updatedAt: '',
  };

  return {
    execute,
    isExecuting: isLoading,
    items,
  };
}
