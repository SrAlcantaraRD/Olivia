import { useCallback, useState } from 'react';

import type { ICarerPort } from '@/domain/carer/port/carer.port';
import { DeleteCarerUseCase } from '@/domain/carer/use-case/delete-carer.use-case';
import type {
  TRequestDeleteCarer,
  TResponseDeleteCarer,
} from '@/domain/carer/use-case-schema/delete-carer.use-case-schema';
import type { TLoggerPort } from '@/domain/core/adapter/logger.adapter';
import type {
  IHookResponse,
  IUseHook,
} from '@/domain/core/interface/hook.interface';
import type { INotifyPort } from '@/domain/core/port/notify.port';

export function useDeleteCarer(adapters: {
  loggerAdapter: TLoggerPort;
  notifyAdapter: INotifyPort;
  carerAdapter: ICarerPort;
}): IUseHook<TRequestDeleteCarer, TResponseDeleteCarer> {
  const [isExecuting, setExecuting] = useState(false);
  const [wasDeleted, setWasDeleted] = useState(false);

  const execute = useCallback(
    async (
      data: TRequestDeleteCarer
    ): Promise<IHookResponse<TResponseDeleteCarer>> => {
      setExecuting(true);
      adapters.notifyAdapter.loading({
        title: 'hook.delete-carer.title',
        description: 'hook.delete-carer.description',
      });

      try {
        const useCase = new DeleteCarerUseCase({
          loggerAdapter: adapters.loggerAdapter,
          carerAdapter: adapters.carerAdapter,
        });

        const response = await useCase.execute({ carerID: data.carerID });

        if (!response.success) {
          adapters.notifyAdapter.error({
            title: 'hook.delete-carer.error-title',
            description: 'hook.delete-carer.error-description',
          });
          return { success: false };
        }

        adapters.notifyAdapter.success({
          title: 'hook.delete-carer.success-title',
          description: 'hook.delete-carer.success-description',
        });

        setWasDeleted(response.details);
        return { success: true, data: response.details };
      } catch (error) {
        adapters.notifyAdapter.error({
          title: 'hook.delete-carer.error-title',
          description: 'hook.delete-carer.error-description',
        });
        adapters.loggerAdapter.error('use-delete-carer', error);
        return { success: false };
      } finally {
        setExecuting(false);
      }
    },
    [adapters.carerAdapter, adapters.loggerAdapter, adapters.notifyAdapter]
  );

  return { execute, isExecuting, items: wasDeleted };
}
