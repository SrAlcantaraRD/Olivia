import { useCallback, useState } from 'react';

import type { TLoggerPort } from '@/domain/core/adapter/logger.adapter';
import type {
  IHookResponse,
  IUseHook,
} from '@/domain/core/interface/hook.interface';
import type { INotifyPort } from '@/domain/core/port/notify.port';
import type { ICarerPort } from '@/domain/carer/port/carer.port';
import type { IInvitePort } from '@/domain/carer/port/invite.port';
import { CreateInviteUseCase } from '@/domain/carer/use-case/create-invite.use-case';
import type {
  TRequestCreateInvite,
  TResponseCreateInvite,
} from '@/domain/carer/use-case-schema/create-invite.use-case-schema';

export function useCreateInvite(adapters: {
  loggerAdapter: TLoggerPort;
  notifyAdapter: INotifyPort;
  carerAdapter: ICarerPort;
  inviteAdapter: IInvitePort;
}): IUseHook<TRequestCreateInvite, TResponseCreateInvite> {
  const [isExecuting, setExecuting] = useState(false);

  const execute = useCallback(
    async (
      data: TRequestCreateInvite
    ): Promise<IHookResponse<TResponseCreateInvite>> => {
      setExecuting(true);
      adapters.notifyAdapter.loading({
        title: 'hook.create-invite.title',
        description: 'hook.create-invite.description',
      });

      try {
        const useCase = new CreateInviteUseCase(
          adapters.loggerAdapter,
          adapters.carerAdapter,
          adapters.inviteAdapter
        );

        const response = await useCase.execute(data);

        if (!response.success) {
          adapters.notifyAdapter.error({
            title: 'hook.create-invite.error-title',
            description: 'hook.create-invite.error-description',
          });
          return { success: false };
        }

        adapters.notifyAdapter.success({
          title: 'hook.create-invite.success-title',
          description: 'hook.create-invite.success-description',
        });

        return response;
      } catch (error) {
        adapters.notifyAdapter.error({
          title: 'hook.create-invite.error-title',
          description: 'hook.create-invite.error-description',
        });
        adapters.loggerAdapter.error('use-create-invite', error);
        return { success: false };
      } finally {
        setExecuting(false);
      }
    },
    [
      adapters.loggerAdapter,
      adapters.carerAdapter,
      adapters.inviteAdapter,
      adapters.notifyAdapter,
    ]
  );

  return { execute, isExecuting, items: undefined };
}
