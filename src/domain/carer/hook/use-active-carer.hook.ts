import { useCallback, useEffect, useState } from 'react';

import type { TCarer } from '@/domain/carer/entity/carer.entity';
import type { ICarerPort } from '@/domain/carer/port/carer.port';
import type { TLoggerPort } from '@/domain/core/adapter/logger.adapter';
import { CACHE_KEY_ENUM } from '@/domain/core/constant/cache-key.constants';
import type { ICachePort } from '@/domain/core/port/cache.port';

export function useActiveCarer(adapters: {
  loggerAdapter: TLoggerPort;
  carerAdapter: ICarerPort;
  cacheAdapter: ICachePort;
}) {
  const [carer, setCarer] = useState<TCarer | null>(null);
  const [isLoading, setLoading] = useState(true);

  const fetchActiveCarer = useCallback(async () => {
    setLoading(true);
    try {
      const carerID = await adapters.cacheAdapter.get<number>(
        CACHE_KEY_ENUM.CARER
      );

      if (carerID === null) {
        setCarer(null);
        return;
      }

      const activeCarer = await adapters.carerAdapter.getByID(carerID);
      setCarer(activeCarer);
    } catch (error) {
      adapters.loggerAdapter.error('useActiveCarer', error);
      setCarer(null);
    } finally {
      setLoading(false);
    }
  }, [adapters.cacheAdapter, adapters.carerAdapter, adapters.loggerAdapter]);

  useEffect(() => {
    fetchActiveCarer();
  }, [fetchActiveCarer]);

  return {
    carer,
    isLoading,
    refresh: fetchActiveCarer,
  };
}
