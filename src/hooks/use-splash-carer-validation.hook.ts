import { useCallback, useState } from 'react';

import type { ICarerPort } from '@/domain/carer/port/carer.port';
import type {
  TCheckCarerExistenceRequest,
  TCheckCarerExistenceResponse,
} from '@/domain/carer/use-case-schema/check-carer-existence.use-case-schema';
import { CheckCarerExistenceUseCase } from '@/domain/carer/use-case/check-carer-existence.use-case';
import type { TLoggerPort } from '@/domain/core/adapter/logger.adapter';
import type {
  IHookResponse,
  IUseHook,
} from '@/domain/core/interface/hook.interface';
import type { INotifyPort } from '@/domain/core/port/notify.port';

export function useSplashCarerValidation(
  loggerAdapter: TLoggerPort,
  notifyAdapter: INotifyPort,
  carerAdapter: ICarerPort
): IUseHook<TCheckCarerExistenceRequest, TCheckCarerExistenceResponse> {
  const [isExecuting, setExecuting] = useState<boolean>(false);

  const execute = useCallback(
    async (
      data: TCheckCarerExistenceRequest
    ): Promise<IHookResponse<TCheckCarerExistenceResponse>> => {
      setExecuting(true);

      try {
        const useCase = new CheckCarerExistenceUseCase(
          loggerAdapter,
          carerAdapter
        );
        const response = await useCase.execute(data);

        if (!response.success) {
          notifyAdapter.error({
            title: 'common.error',
            description: response.message,
          });
          return { success: false };
        }

        return { success: true, data: response.details };
      } catch (error) {
        notifyAdapter.error({
          title: 'common.error',
          description: 'common.error',
        });
        return { success: false };
      } finally {
        setExecuting(false);
      }
    },
    [loggerAdapter, notifyAdapter, carerAdapter]
  );

  return { execute, isExecuting };
}
