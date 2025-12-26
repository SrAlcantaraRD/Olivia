import { useCallback, useState } from 'react';

import type { ICarerPort } from '@/domain/carer/port/carer.port';
import type {
  TRequestSecondaryCarerGenerateInvitationQR,
  TResponseSecondaryCarerGenerateInvitationQR,
} from '@/domain/carer/use-case-schema/secondary-carer.generate-invitation-qr.use-case-schema';
import { SecondaryCarerGenerateInvitationQRUseCase } from '@/domain/carer/use-case/secondary-carer.generate-invitation-qr.use-case';
import type { TLoggerPort } from '@/domain/core/adapter/logger.adapter';
import type {
  IHookResponse,
  IUseHook,
} from '@/domain/core/interface/hook.interface';
import type { ICachePort } from '@/domain/core/port/cache.port';
import type { INotifyPort } from '@/domain/core/port/notify.port';
import type { IQRPort } from '@/domain/core/port/qr.port';
import type { IModulePort } from '@/domain/module/port/module.port';
import { DEFAULT_DATA } from '@/ui/components/organisms/generate-invitation-qr-wizard/hooks/use-generate-invitation-qr-form.hook';

export function useSecondaryCarerGenerateInvitationQR(adapters: {
  loggerAdapter: TLoggerPort;
  notifyAdapter: INotifyPort;
  carerAdapter: ICarerPort;
  qrAdapter: IQRPort;
  cacheAdapter: ICachePort;
  moduleAdapter: IModulePort;
}): IUseHook<
  TRequestSecondaryCarerGenerateInvitationQR,
  TResponseSecondaryCarerGenerateInvitationQR
> {
  const [isExecuting, setExecuting] = useState(false);
  const [item, setItems] =
    useState<TResponseSecondaryCarerGenerateInvitationQR>(
      DEFAULT_DATA.invitationDetails
    );

  const execute = useCallback(
    async (
      data: TRequestSecondaryCarerGenerateInvitationQR
    ): Promise<IHookResponse<TResponseSecondaryCarerGenerateInvitationQR>> => {
      setExecuting(true);
      adapters.notifyAdapter.loading({
        title: 'hook.secondary-carer.generate-invitation-qr.title',
        description: 'hook.secondary-carer.generate-invitation-qr.description',
      });

      try {
        const useCase = new SecondaryCarerGenerateInvitationQRUseCase({
          loggerAdapter: adapters.loggerAdapter,
          carerAdapter: adapters.carerAdapter,
          qrAdapter: adapters.qrAdapter,
          cacheAdapter: adapters.cacheAdapter,
          moduleAdapter: adapters.moduleAdapter,
        });

        const response = await useCase.execute(data);

        if (!response.success) {
          adapters.notifyAdapter.error({
            title: 'hook.secondary-carer.generate-invitation-qr.error-title',
            description:
              'hook.secondary-carer.generate-invitation-qr.error-description',
          });
          return { success: false };
        }

        adapters.notifyAdapter.success({
          title: 'hook.secondary-carer.generate-invitation-qr.success-title',
          description:
            'hook.secondary-carer.generate-invitation-qr.success-description',
        });

        setItems(response.details);

        return {
          success: true,
          data: response.details,
        };
      } catch (error) {
        adapters.notifyAdapter.error({
          title: 'hook.secondary-carer.generate-invitation-qr.error-title',
          description:
            'hook.secondary-carer.generate-invitation-qr.error-description',
        });
        adapters.loggerAdapter.error(
          'use-secondary-carer.generate-invitation-qr',
          error
        );
        return { success: false };
      } finally {
        setExecuting(false);
      }
    },
    [
      adapters.loggerAdapter,
      adapters.carerAdapter,
      adapters.qrAdapter,
      adapters.notifyAdapter,
      adapters.cacheAdapter,
    ]
  );

  return { execute, isExecuting, items: item };
}
