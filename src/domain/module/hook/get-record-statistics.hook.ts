import { useCallback, useState } from 'react';

import type { TLoggerPort } from '@/domain/core/adapter/logger.adapter';
import type {
  IHookResponse,
  IUseHook,
} from '@/domain/core/interface/hook.interface';
import type { INotifyPort } from '@/domain/core/port/notify.port';
import type { IRecordPort } from '@/domain/module/port/record.port';
import {
  GetRecordStatisticsUseCase,
  type TResponseRecordStatistics,
} from '@/domain/module/use-case/get-record-statistics.use-case';

export function useGetRecordStatistics(adapters: {
  loggerAdapter: TLoggerPort;
  recordAdapter: IRecordPort;
  notifyAdapter: INotifyPort;
}): IUseHook<{ startDate?: Date; endDate?: Date }, TResponseRecordStatistics> {
  const [items, setItems] = useState<TResponseRecordStatistics>({
    countsByModule: [],
  });
  const [isExecuting, setIsExecuting] = useState(false);

  const { loggerAdapter, recordAdapter, notifyAdapter } = adapters;

  const execute = useCallback(
    async (data: {
      startDate?: Date;
      endDate?: Date;
    }): Promise<IHookResponse<TResponseRecordStatistics>> => {
      setIsExecuting(true);
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

        setItems(response.details);

        return { success: true, data: response.details };
      } catch (error) {
        console.error(error);
        return { success: false };
      } finally {
        setIsExecuting(false);
      }
    },
    [loggerAdapter, recordAdapter, notifyAdapter]
  );

  return {
    execute,
    isExecuting,
    items,
  };
}
