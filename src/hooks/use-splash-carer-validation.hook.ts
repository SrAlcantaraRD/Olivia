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
import type { INavigationPort } from '@/domain/ports/navigation.port';

export function useSplashCarerValidation(adapters: {
  loggerAdapter: TLoggerPort;
  notifyAdapter: INotifyPort;
  carerAdapter: ICarerPort;
  navigationAdapter: INavigationPort;
}): IUseHook<TCheckCarerExistenceRequest, TCheckCarerExistenceResponse> {
  const [isExecuting, setExecuting] = useState<boolean>(false);

  const { loggerAdapter, notifyAdapter, carerAdapter, navigationAdapter } =
    adapters;

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

        // sleep for 3s to show splash screen
        await new Promise((resolve) => setTimeout(resolve, 3000));

        if (!response.success) {
          return { success: false };
        }

        // TODO: ¿Should use useNavigation hook?
        navigationAdapter.navigateTo('/(tabs)/register');

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
