import { useCallback, useState } from 'react';

import type { INotifyPort } from '@/domain/core/port/notify.port';
import type {
  IHookResponse,
  IUseHook,
} from '@/domain/core/interface/hook.interface';
import type { TLoggerPort } from '@/domain/core/adapter/logger.adapter';
import type { ICachePort } from '@/domain/core/port/cache.port';
import type { ICarerPort } from '@/domain/carer/port/carer.port';
import type { IInvitePort } from '@/domain/carer/port/invite.port';
import { ImportInviteUseCase } from '@/domain/carer/use-case/import-invite.use-case';
import type {
  TRequestImportInvite,
  TResponseImportInvite,
} from '@/domain/carer/use-case-schema/import-invite.use-case-schema';

export function useImportInvite(adapters: {
  loggerAdapter: TLoggerPort;
  notifyAdapter: INotifyPort;
  inviteAdapter: IInvitePort;
  carerAdapter: ICarerPort;
  cacheAdapter: ICachePort;
  secureStoreAdapter: ICachePort;
}): IUseHook<TRequestImportInvite, TResponseImportInvite> {
  const [isExecuting, setExecuting] = useState(false);

  const execute = useCallback(
    async (
      data: TRequestImportInvite
    ): Promise<IHookResponse<TResponseImportInvite>> => {
      setExecuting(true);
      adapters.notifyAdapter.loading({
        title: 'hook.import-invite.title',
        description: 'hook.import-invite.description',
      });

      try {
        const useCase = new ImportInviteUseCase(
          adapters.loggerAdapter,
          adapters.inviteAdapter,
          adapters.carerAdapter,
          adapters.cacheAdapter,
          adapters.secureStoreAdapter
        );

        const response = await useCase.execute(data);

        if (!response.success) {
          adapters.notifyAdapter.error({
            title: 'hook.import-invite.error-title',
            description: 'hook.import-invite.error-description',
          });
          return { success: false };
        }

        adapters.notifyAdapter.success({
          title: 'hook.import-invite.success-title',
          description: 'hook.import-invite.success-description',
        });

        return response;
      } catch (error) {
        adapters.notifyAdapter.error({
          title: 'hook.import-invite.error-title',
          description: 'hook.import-invite.error-description',
        });
        adapters.loggerAdapter.error('use-import-invite', error);
        return { success: false };
      } finally {
        setExecuting(false);
      }
    },
    [
      adapters.loggerAdapter,
      adapters.inviteAdapter,
      adapters.carerAdapter,
      adapters.cacheAdapter,
      adapters.secureStoreAdapter,
      adapters.notifyAdapter,
    ]
  );

  return { execute, isExecuting, items: undefined };
}
