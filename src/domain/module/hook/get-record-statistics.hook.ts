import { useCallback } from 'react';

import type { TLoggerPort } from '@/domain/core/adapter/logger.adapter';
import type {
  IHookResponse,
  IUseHook,
} from '@/domain/core/interface/hook.interface';
import type { INotifyPort } from '@/domain/core/port/notify.port';
import type { TID } from '@/domain/core/schemas/id.schema';
import { useListStore } from '@/domain/core/stores/list.store';
import type { IRecordPort } from '@/domain/module/port/record.port';
import { GetRecordStatisticsUseCase } from '@/domain/module/use-case/get-record-statistics.use-case';

export function useGetRecordStatistics(adapters: {
  loggerAdapter: TLoggerPort;
  recordAdapter: IRecordPort;
  notifyAdapter: INotifyPort;
}): IUseHook<
  { startDate?: Date; endDate?: Date },
  { moduleID: TID; count: number }[]
> {
  const {
    actions: { saveItems, getItems, startLoading, stopLoading },
  } = useListStore('report');

  const { loggerAdapter, recordAdapter, notifyAdapter } = adapters;

  const execute = useCallback(
    async (data: {
      startDate?: Date;
      endDate?: Date;
    }): Promise<IHookResponse<{ moduleID: TID; count: number }[]>> => {
      startLoading();
      try {
        const useCase = new GetRecordStatisticsUseCase({
          loggerAdapter,
          recordAdapter,
        });
        const response = await useCase.execute(data);

        if (!response.success || !response.details) {
          notifyAdapter.error({
            title: 'hook.get-record-statistics.error',
            description: response.message,
          });
          return { success: false };
        }

        saveItems(response.details.countsByModule);

        return { success: true, data: response.details.countsByModule };
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
