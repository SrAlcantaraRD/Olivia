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
import type { ICachePort } from '@/domain/core/port/cache.port';
import type { INavigationPort } from '@/domain/core/port/navigation.port';
import type { INotifyPort } from '@/domain/core/port/notify.port';
import { useNavigation } from '@/ui/hook/use-navigation.hook';

export function useSplashCarerValidation(adapters: {
  loggerAdapter: TLoggerPort;
  notifyAdapter: INotifyPort;
  carerAdapter: ICarerPort;
  navigationAdapter: INavigationPort;
  cacheAdapter: ICachePort;
}): IUseHook<TCheckCarerExistenceRequest, TCheckCarerExistenceResponse> {
  const [isExecuting, setExecuting] = useState<boolean>(false);

  // add a zustand store

  const {
    loggerAdapter,
    notifyAdapter,
    carerAdapter,
    cacheAdapter,
    navigationAdapter,
  } = adapters;
  const { goToRegisterHome } = useNavigation({ navigationAdapter });

  const execute = useCallback(async (): Promise<
    IHookResponse<TCheckCarerExistenceResponse>
  > => {
    setExecuting(true);

    try {
      const useCase = new CheckCarerExistenceUseCase({
        loggerAdapter,
        cacheAdapter,
      });
      const response = await useCase.execute();

      if (!response.success || !response.details.exists) {
        return { success: false };
      }

      goToRegisterHome();

      return { success: true, data: response.details };
    } catch (_error) {
      notifyAdapter.error({
        title: 'common.error',
        description: 'common.error',
      });
      return { success: false };
    } finally {
      setExecuting(false);
    }
  }, [loggerAdapter, notifyAdapter, carerAdapter, goToRegisterHome]);

  return {
    execute,
    isExecuting,
    items: {
      exists: false,
    },
  };
}
