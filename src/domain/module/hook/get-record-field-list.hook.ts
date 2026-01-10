import { useCallback, useState } from 'react';

import type { TLoggerPort } from '@/domain/core/adapter/logger.adapter';
import type {
  IHookResponse,
  IUseHook,
} from '@/domain/core/interface/hook.interface';
import type { INotifyPort } from '@/domain/core/port/notify.port';
import type { IRecordFieldPort } from '@/domain/module/port/record-field.port';
import { GetRecordFieldListUseCase } from '@/domain/module/use-case/get-record-field-list.use-case';
import type {
  TRequestGetRecordFieldList,
  TResponseGetRecordFieldList,
} from '@/domain/module/use-case-schema/get-record-field-list.use-case-schema';

export function useGetRecordFieldList(adapters: {
  loggerAdapter: TLoggerPort;
  recordFieldAdapter: IRecordFieldPort;
  notifyAdapter: INotifyPort;
}): IUseHook<TRequestGetRecordFieldList, TResponseGetRecordFieldList> {
  const [items, setItems] = useState<TResponseGetRecordFieldList>([]);
  const [isExecuting, setIsExecuting] = useState(false);

  const { loggerAdapter, recordFieldAdapter, notifyAdapter } = adapters;

  const execute = useCallback(
    async (
      data: TRequestGetRecordFieldList
    ): Promise<IHookResponse<TResponseGetRecordFieldList>> => {
      setIsExecuting(true);
      try {
        const useCase = new GetRecordFieldListUseCase({
          loggerAdapter,
          recordFieldAdapter,
        });

        const response = await useCase.execute(data);

        if (!response.success || response.details === undefined) {
          notifyAdapter.error({
            title: 'common.error',
            description: response.message,
          });
          return { success: false };
        }

        setItems(response.details);

        return { success: true, data: response.details };
      } catch (error) {
        loggerAdapter.error('useGetRecordFieldList.execute', error);
        return { success: false };
      } finally {
        setIsExecuting(false);
      }
    },
    [loggerAdapter, recordFieldAdapter, notifyAdapter]
  );

  return {
    execute,
    isExecuting,
    items,
  };
}
