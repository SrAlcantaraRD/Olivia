import { useCallback } from 'react';

import type { TLoggerPort } from '@/domain/core/adapter/logger.adapter';
import type {
  IHookResponse,
  IUseHook,
} from '@/domain/core/interface/hook.interface';
import type { INotifyPort } from '@/domain/core/port/notify.port';
import { useListStore } from '@/domain/core/stores/list.store';
import type { TSummarySnapshot } from '@/domain/summary/entity/summary-snapshot.entity';
import type { ISummaryHighlightPort } from '@/domain/summary/port/summary-highlight.port';
import type { ISummaryModulePort } from '@/domain/summary/port/summary-module.port';
import type { ISummarySnapshotPort } from '@/domain/summary/port/summary-snapshot.port';
import type { ISummaryTrendPort } from '@/domain/summary/port/summary-trend.port';
import { RefreshSummarySnapshotsUseCase } from '@/domain/summary/use-case/refresh-summary-snapshots.use-case';
import type { TRequestRefreshSummarySnapshots } from '@/domain/summary/use-case-schema/refresh-summary-snapshots.use-case-schema';

export function useRefreshSummarySnapshots(adapters: {
  loggerAdapter: TLoggerPort;
  summaryModuleAdapter: ISummaryModulePort;
  summaryTrendAdapter: ISummaryTrendPort;
  summaryHighlightAdapter: ISummaryHighlightPort;
  summarySnapshotAdapter: ISummarySnapshotPort;
  notifyAdapter: INotifyPort;
}): IUseHook<TRequestRefreshSummarySnapshots, TSummarySnapshot> {
  const {
    actions: { saveItems, getItems, isLoading, startLoading, stopLoading },
  } = useListStore<TSummarySnapshot>('summary-snapshot');

  const {
    loggerAdapter,
    summaryModuleAdapter,
    summaryTrendAdapter,
    summaryHighlightAdapter,
    summarySnapshotAdapter,
    notifyAdapter,
  } = adapters;

  const execute = useCallback(
    async (
      data: TRequestRefreshSummarySnapshots
    ): Promise<IHookResponse<TSummarySnapshot>> => {
      startLoading();
      try {
        const useCase = new RefreshSummarySnapshotsUseCase({
          loggerAdapter,
          summaryModuleAdapter,
          summaryTrendAdapter,
          summaryHighlightAdapter,
          summarySnapshotAdapter,
        });

        const response = await useCase.execute(data);

        if (!response.success || !response.details) {
          notifyAdapter.error({
            title: 'hook.refresh-summary-snapshots.error',
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
    [
      loggerAdapter,
      summaryModuleAdapter,
      summaryTrendAdapter,
      summaryHighlightAdapter,
      summarySnapshotAdapter,
      notifyAdapter,
    ]
  );

  const items = getItems()[0] ?? {
    modules: [],
    trends: [],
    highlights: [],
    updatedAt: '',
  };

  return {
    execute,
    isExecuting: isLoading(),
    items,
  };
}
