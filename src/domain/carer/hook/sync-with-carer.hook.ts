import { useCallback, useState } from 'react';

import { SyncWithCarerUseCase } from '@/domain/carer/use-case/sync-carer.use-case';
import type {
  TRequestSyncWithCarer,
  TResponseSyncWithCarer,
} from '@/domain/carer/use-case-schema/sync-carer.use-case-schema';
import type { TLoggerPort } from '@/domain/core/adapter/logger.adapter';
import type {
  IHookResponse,
  IUseHook,
} from '@/domain/core/interface/hook.interface';
import type { ICachePort } from '@/domain/core/port/cache.port';
import type { INotifyPort } from '@/domain/core/port/notify.port';

export function useSyncWithCarer(adapters: {
  loggerAdapter: TLoggerPort;
  notifyAdapter: INotifyPort;
  cacheAdapter: ICachePort;
}): IUseHook<TRequestSyncWithCarer, TResponseSyncWithCarer> {
  const [isExecuting, setExecuting] = useState(false);

  const execute = useCallback(
    async (
      data: TRequestSyncWithCarer
    ): Promise<IHookResponse<TResponseSyncWithCarer>> => {
      setExecuting(true);
      adapters.notifyAdapter.loading({
        title: 'hook.sync-with-carer.title',
        description: 'hook.sync-with-carer.description',
      });

      try {
        const useCase = new SyncWithCarerUseCase({
          loggerAdapter: adapters.loggerAdapter,
          cacheAdapter: adapters.cacheAdapter,
        });

        const response = await useCase.execute(data);

        if (!response.success) {
          adapters.notifyAdapter.error({
            title: 'hook.sync-with-carer.error-title',
            description: 'hook.sync-with-carer.error-description',
          });
          return { success: false };
        }

        adapters.notifyAdapter.success({
          title: 'hook.sync-with-carer.success-title',
          description: 'hook.sync-with-carer.success-description',
        });

        return {
          success: true,
          data: response.details,
        };
      } catch (error) {
        adapters.notifyAdapter.error({
          title: 'hook.sync-with-carer.error-title',
          description: 'hook.sync-with-carer.error-description',
        });
        adapters.loggerAdapter.error('use-sync-with-carer', error);
        return { success: false };
      } finally {
        setExecuting(false);
      }
    },
    [adapters.cacheAdapter, adapters.loggerAdapter, adapters.notifyAdapter]
  );

  return { execute, isExecuting, items: undefined };
}
