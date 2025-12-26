import { useCallback, useState } from 'react';

import type { TCarer } from '@/domain/carer/entity/carer.entity';
import { CARER_TYPE_ENUM } from '@/domain/carer/enum/carer-type.enums';
import type { ICarerPort } from '@/domain/carer/port/carer.port';
import type {
  TRequestSecondaryCarerConsumeInvitation,
  TResponseSecondaryCarerConsumeInvitation,
} from '@/domain/carer/use-case-schema/secondary-carer.consume-invitation-qr.use-case-schema';
import { SecondaryCarerConsumeInvitationQRUseCase } from '@/domain/carer/use-case/secondary-carer.consume-invitation-qr.use-case';
import type { TLoggerPort } from '@/domain/core/adapter/logger.adapter';
import { STATUS_ENUM } from '@/domain/core/enum/status.enum';
import type {
  IHookResponse,
  IUseHook,
} from '@/domain/core/interface/hook.interface';
import type { ICachePort } from '@/domain/core/port/cache.port';
import type { INotifyPort } from '@/domain/core/port/notify.port';
import type { IQRPort } from '@/domain/core/port/qr.port';
import type { IModuleFieldPort } from '@/domain/module/port/module-field.port';
import type { IModulePort } from '@/domain/module/port/module.port';

export function useSecondaryCarerConsumeInvitationQR(adapters: {
  loggerAdapter: TLoggerPort;
  notifyAdapter: INotifyPort;
  carerAdapter: ICarerPort;
  cacheAdapter: ICachePort;
  qrAdapter: IQRPort;
  moduleAdapter: IModulePort;
  moduleFieldAdapter: IModuleFieldPort;
}): IUseHook<
  TRequestSecondaryCarerConsumeInvitation,
  TResponseSecondaryCarerConsumeInvitation
> {
  const [isExecuting, setExecuting] = useState(false);
  const [carer, setCarer] = useState<TCarer>({
    createdAt: new Date(),
    id: -1,
    isPrimary: false,
    name: '',
    pinHash: '',
    status: STATUS_ENUM.INACTIVE,
    type: CARER_TYPE_ENUM.SECONDARY,
  });

  const execute = useCallback(
    async (
      data: TRequestSecondaryCarerConsumeInvitation
    ): Promise<IHookResponse<TResponseSecondaryCarerConsumeInvitation>> => {
      setExecuting(true);
      adapters.notifyAdapter.loading({
        title: 'hook.create-secondary-carer.title',
        description: 'hook.create-secondary-carer.description',
      });

      try {
        const useCase = new SecondaryCarerConsumeInvitationQRUseCase({
          loggerAdapter: adapters.loggerAdapter,
          carerAdapter: adapters.carerAdapter,
          cacheAdapter: adapters.cacheAdapter,
          qrAdapter: adapters.qrAdapter,
          moduleAdapter: adapters.moduleAdapter,
          moduleFieldAdapter: adapters.moduleFieldAdapter,
        });

        const response = await useCase.execute(data);

        if (!response.success) {
          adapters.notifyAdapter.error({
            title: 'hook.create-secondary-carer.error-title',
            description: 'hook.create-secondary-carer.error-description',
          });
          return { success: false };
        }

        adapters.notifyAdapter.success({
          title: 'hook.create-secondary-carer.success-title',
          description: 'hook.create-secondary-carer.success-description',
        });

        setCarer(response.details);
        return {
          success: true,
          data: response.details,
        };
      } catch (error) {
        adapters.notifyAdapter.error({
          title: 'hook.create-secondary-carer.error-title',
          description: 'hook.create-secondary-carer.error-description',
        });
        adapters.loggerAdapter.error('use-create-secondary-carer', error);
        return { success: false };
      } finally {
        setExecuting(false);
      }
    },
    [adapters.carerAdapter, adapters.loggerAdapter, adapters.notifyAdapter]
  );

  return { execute, isExecuting, items: carer };
}
