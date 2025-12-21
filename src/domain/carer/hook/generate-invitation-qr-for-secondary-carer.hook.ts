import { useCallback, useState } from 'react';

import type { ICarerPort } from '@/domain/carer/port/carer.port';
import type {
  TRequestGenerateInvitationQRForSecondaryCarer,
  TResponseGenerateInvitationQRForSecondaryCarer,
} from '@/domain/carer/use-case-schema/generate-invitation-qr-for-secondary-carer.use-case-schema';
import { GenerateInvitationQRForSecondaryCarerUseCase } from '@/domain/carer/use-case/generate-invitation-qr-for-secondary-carer.use-case';
import type { TLoggerPort } from '@/domain/core/adapter/logger.adapter';
import type {
  IHookResponse,
  IUseHook,
} from '@/domain/core/interface/hook.interface';
import type { ICachePort } from '@/domain/core/port/cache.port';
import type { INotifyPort } from '@/domain/core/port/notify.port';
import type { IQRPort } from '@/domain/core/port/qr.port';

export function useGenerateInvitationQRForSecondaryCarer(adapters: {
  loggerAdapter: TLoggerPort;
  notifyAdapter: INotifyPort;
  carerAdapter: ICarerPort;
  qrAdapter: IQRPort;
  cacheAdapter: ICachePort;
}): IUseHook<
  TRequestGenerateInvitationQRForSecondaryCarer,
  TResponseGenerateInvitationQRForSecondaryCarer
> {
  const [isExecuting, setExecuting] = useState(false);
  const [item, setItems] =
    useState<TResponseGenerateInvitationQRForSecondaryCarer>();

  const execute = useCallback(
    async (
      data: TRequestGenerateInvitationQRForSecondaryCarer
    ): Promise<
      IHookResponse<TResponseGenerateInvitationQRForSecondaryCarer>
    > => {
      setExecuting(true);
      adapters.notifyAdapter.loading({
        title: 'hook.generate-invitation-qr-for-secondary-carer.title',
        description:
          'hook.generate-invitation-qr-for-secondary-carer.description',
      });

      try {
        const useCase = new GenerateInvitationQRForSecondaryCarerUseCase({
          loggerAdapter: adapters.loggerAdapter,
          carerAdapter: adapters.carerAdapter,
          qrAdapter: adapters.qrAdapter,
          cacheAdapter: adapters.cacheAdapter,
        });

        const response = await useCase.execute(data);

        if (!response.success) {
          adapters.notifyAdapter.error({
            title:
              'hook.generate-invitation-qr-for-secondary-carer.error-title',
            description:
              'hook.generate-invitation-qr-for-secondary-carer.error-description',
          });
          return { success: false };
        }

        adapters.notifyAdapter.success({
          title:
            'hook.generate-invitation-qr-for-secondary-carer.success-title',
          description:
            'hook.generate-invitation-qr-for-secondary-carer.success-description',
        });

        setItems(response.details);

        return {
          success: true,
          data: response.details,
        };
      } catch (error) {
        adapters.notifyAdapter.error({
          title: 'hook.generate-invitation-qr-for-secondary-carer.error-title',
          description:
            'hook.generate-invitation-qr-for-secondary-carer.error-description',
        });
        adapters.loggerAdapter.error(
          'use-generate-invitation-qr-for-secondary-carer',
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
