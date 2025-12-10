import { useCallback, useState } from 'react';

import type { TLoggerPort } from '@/domain/core/adapter/logger.adapter';
import type { ICachePort } from '@/domain/core/port/cache.port';
import { WipeLocalDataUseCase } from '@/domain/core/use-case/wipe-local-data.use-case';

export function useWipeLocalData(adapters: {
  loggerAdapter: TLoggerPort;
  cacheAdapter: ICachePort;
  secureStoreAdapter: ICachePort;
}) {
  const { loggerAdapter, cacheAdapter, secureStoreAdapter } = adapters;
  const [isExecuting, setExecuting] = useState(false);

  const execute = useCallback(async () => {
    setExecuting(true);
    try {
      const usecase = new WipeLocalDataUseCase(
        loggerAdapter,
        cacheAdapter,
        secureStoreAdapter
      );
      const resp = await usecase.execute();
      return resp;
    } finally {
      setExecuting(false);
    }
  }, [loggerAdapter, cacheAdapter, secureStoreAdapter]);

  return {
    execute,
    isExecuting,
  } as const;
}
