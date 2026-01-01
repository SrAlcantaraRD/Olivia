import { useCallback, useState } from 'react';

import type { TCarer } from '@/domain/carer/entity/carer.entity';
import { CARER_TYPE_ENUM } from '@/domain/carer/enum/carer-type.enums';
import type { ICarerPort } from '@/domain/carer/port/carer.port';
import { CreateCarerUseCase } from '@/domain/carer/use-case/create-carer.use-case';
import type {
  TRequestCreateCarer,
  TResponseCreateCarer,
} from '@/domain/carer/use-case-schema/create-carer.use-case-schema';
import type { TLoggerPort } from '@/domain/core/adapter/logger.adapter';
import { STATUS_ENUM } from '@/domain/core/enum/status.enum';
import type {
  IHookResponse,
  IUseHook,
} from '@/domain/core/interface/hook.interface';
import type { INotifyPort } from '@/domain/core/port/notify.port';

export function useCreateCarer(adapters: {
  loggerAdapter: TLoggerPort;
  notifyAdapter: INotifyPort;
  carerAdapter: ICarerPort;
}): IUseHook<TRequestCreateCarer, TResponseCreateCarer> {
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
      data: TRequestCreateCarer
    ): Promise<IHookResponse<TResponseCreateCarer>> => {
      setExecuting(true);
      adapters.notifyAdapter.loading({
        title: 'hook.create-carer.title',
        description: 'hook.create-carer.description',
      });

      try {
        const useCase = new CreateCarerUseCase({
          loggerAdapter: adapters.loggerAdapter,
          carerAdapter: adapters.carerAdapter,
        });

        const response = await useCase.execute(data);

        if (!response.success) {
          adapters.notifyAdapter.error({
            title: 'hook.create-carer.error-title',
            description: 'hook.create-carer.error-description',
          });
          return { success: false };
        }

        adapters.notifyAdapter.success({
          title: 'hook.create-carer.success-title',
          description: 'hook.create-carer.success-description',
        });

        setCarer(response.details);

        return { success: true, data: response.details };
      } catch (error) {
        adapters.notifyAdapter.error({
          title: 'hook.create-carer.error-title',
          description: 'hook.create-carer.error-description',
        });
        adapters.loggerAdapter.error('use-create-carer', error);
        return { success: false };
      } finally {
        setExecuting(false);
      }
    },
    [adapters.carerAdapter, adapters.loggerAdapter, adapters.notifyAdapter]
  );

  return { execute, isExecuting, items: carer };
}
