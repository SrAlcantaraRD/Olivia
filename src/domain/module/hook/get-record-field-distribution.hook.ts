import { useCallback } from 'react';

import type { TLoggerPort } from '@/domain/core/adapter/logger.adapter';
import type {
  IHookResponse,
  IUseHook,
} from '@/domain/core/interface/hook.interface';
import type { INotifyPort } from '@/domain/core/port/notify.port';
import { useListStore } from '@/domain/core/stores/list.store';
import type { IRecordPort } from '@/domain/module/port/record.port';
import { GetRecordFieldDistributionUseCase } from '@/domain/module/use-case/get-record-field-distribution.use-case';

export function useGetRecordFieldDistribution(adapters: {
  loggerAdapter: TLoggerPort;
  recordAdapter: IRecordPort;
  notifyAdapter: INotifyPort;
}): IUseHook<
  { fieldID: number; moduleID?: number; start?: number; end?: number },
  { value: string; count: number }[]
> {
  const {
    actions: { saveItems, getItems, startLoading, stopLoading },
  } = useListStore('report-field-distribution');

  const { loggerAdapter, recordAdapter, notifyAdapter } = adapters;

  const execute = useCallback(
    async (data: {
      fieldID: number;
      moduleID?: number;
      start?: number;
      end?: number;
    }): Promise<IHookResponse<{ value: string; count: number }[]>> => {
      startLoading();
      try {
        const useCase = new GetRecordFieldDistributionUseCase({
          loggerAdapter,
          recordAdapter,
        });
        const response = await useCase.execute(data);
        if (!response.success || !response.details) {
          notifyAdapter.error({
            title: 'hook.get-record-field-distribution.error',
            description: response.message,
          });
          return { success: false };
        }

        saveItems(response.details.values);
        return { success: true, data: response.details.values };
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
  } as unknown as IUseHook<
    { fieldID: number; moduleID?: number; start?: number; end?: number },
    { value: string; count: number }[]
  >;
}
