import { useCallback } from 'react';

import type { TLoggerPort } from '@/domain/core/adapter/logger.adapter';
import type {
  IHookResponse,
  IUseHook,
} from '@/domain/core/interface/hook.interface';
import type { INotifyPort } from '@/domain/core/port/notify.port';
import { useListStore } from '@/domain/core/stores/list.store';
import type { TRecordCreate } from '@/domain/module/entity/record.entity';
import type { IRecordFieldPort } from '@/domain/module/port/record-field.port';
import type { IRecordPort } from '@/domain/module/port/record.port';
import { CreateRecordUseCase } from '@/domain/module/use-case/create-record.use-case';

export function useCreateRecord(adapters: {
  loggerAdapter: TLoggerPort;
  notifyAdapter: INotifyPort;
  recordAdapter: IRecordPort;
  recordFieldAdapter: IRecordFieldPort;
}): IUseHook<TRecordCreate, void> {
  const {
    actions: { startLoading, stopLoading },
  } = useListStore('record');
  const { loggerAdapter, recordAdapter, notifyAdapter, recordFieldAdapter } =
    adapters;

  const execute = useCallback(
    async (data: TRecordCreate): Promise<IHookResponse<void>> => {
      startLoading();
      try {
        const useCase = new CreateRecordUseCase({
          loggerAdapter,
          recordAdapter,
          recordFieldAdapter,
        });

        const response = await useCase.execute(data);

        if (!response.success) {
          notifyAdapter.error({
            title: 'hook.create-record.error-title',
            description: response.message,
          });
          return { success: false };
        }

        notifyAdapter.success({
          title: 'hook.create-record.success-title',
          description: 'common.success',
        });

        return { success: true };
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
  } as unknown as IUseHook<TRecordCreate, void>;
}
