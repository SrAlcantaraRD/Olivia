import { useCallback } from 'react';

import type { TLoggerPort } from '@/domain/core/adapter/logger.adapter';
import type {
  IHookResponse,
  IUseHook,
} from '@/domain/core/interface/hook.interface';
import type { INotifyPort } from '@/domain/core/port/notify.port';
import { useListStore } from '@/domain/core/stores/list.store';
import type { IRecordPort } from '@/domain/module/port/record.port';
import { GetRecordTrendUseCase } from '@/domain/module/use-case/get-record-trend.use-case';

export function useGetRecordTrend(adapters: {
  loggerAdapter: TLoggerPort;
  recordAdapter: IRecordPort;
  notifyAdapter: INotifyPort;
}): IUseHook<
  { startDate?: Date; endDate?: Date; moduleID?: number },
  { day: string; count: number }[]
> {
  const {
    actions: { getItems, startLoading, stopLoading },
  } = useListStore<{ day: string; count: number }>('report-trend');

  const { loggerAdapter, recordAdapter, notifyAdapter } = adapters;

  const execute = useCallback(
    async (data: {
      startDate?: Date;
      endDate?: Date;
      moduleID?: number;
    }): Promise<IHookResponse<{ day: string; count: number }[]>> => {
      startLoading();
      try {
        const useCase = new GetRecordTrendUseCase({
          loggerAdapter,
          recordAdapter,
        });
        const response = await useCase.execute(data);
        if (!response.success || !response.details) {
          notifyAdapter.error({
            title: 'hook.get-record-trend.error',
            description: response.message,
          });
          return { success: false };
        }

        // don't store non-entity series in the generic list store
        return { success: true, data: response.details.series };
      } catch (error) {
        console.error(error);
        return { success: false };
      } finally {
        stopLoading();
      }
    },
    [loggerAdapter, recordAdapter, notifyAdapter]
  );

  return {
    execute,
    isExecuting: false,
    items: getItems() ?? [],
  };
}
