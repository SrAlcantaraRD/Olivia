import { getUnixTime } from 'date-fns';
import { useCallback, useState } from 'react';

import type { TLoggerPort } from '@/domain/core/adapter/logger.adapter';
import {
  buildCacheKey,
  CACHE_KEY_ENUM,
} from '@/domain/core/constant/cache-key.constants';
import type {
  IHookResponse,
  IUseHook,
} from '@/domain/core/interface/hook.interface';
import type { ICachePort } from '@/domain/core/port/cache.port';
import type { INotifyPort } from '@/domain/core/port/notify.port';
import type { IRecordPort } from '@/domain/module/port/record.port';
import { GetRecordFieldDistributionUseCase } from '@/domain/module/use-case/get-record-field-distribution.use-case';

export function useGetRecordFieldDistribution(adapters: {
  loggerAdapter: TLoggerPort;
  recordAdapter: IRecordPort;
  notifyAdapter: INotifyPort;
  cacheAdapter?: ICachePort;
}): IUseHook<
  { fieldID: number; moduleID?: number; startDate?: Date; endDate?: Date },
  { value: string; count: number }[]
> {
  const [items, setItems] = useState<{ value: string; count: number }[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);

  const { loggerAdapter, recordAdapter, notifyAdapter, cacheAdapter } =
    adapters;

  const execute = useCallback(
    async (data: {
      fieldID: number;
      moduleID?: number;
      startDate?: Date;
      endDate?: Date;
    }): Promise<IHookResponse<{ value: string; count: number }[]>> => {
      setIsExecuting(true);
      try {
        const startEpoch = data.startDate ? getUnixTime(data.startDate) : 0;
        const endEpoch = data.endDate ? getUnixTime(data.endDate) : 0;

        const cacheKey = buildCacheKey(
          CACHE_KEY_ENUM.REPORT_DISTRIBUTION,
          data.moduleID ?? 'global',
          data.fieldID,
          startEpoch,
          endEpoch
        );

        // try to get from cache
        if (cacheAdapter) {
          try {
            const cached =
              await cacheAdapter.get<{ value: string; count: number }[]>(
                cacheKey
              );
            if (cached && cached.length > 0) {
              setItems(cached);
              return { success: true, data: cached };
            }
          } catch (err) {
            // ignore cache errors and continue

            console.warn('cache.get failed', err);
          }
        }

        const useCase = new GetRecordFieldDistributionUseCase({
          loggerAdapter,
          recordAdapter,
        });
        const response = await useCase.execute(data);
        if (!response.success || !response.details) {
          notifyAdapter.error({
            title: 'hook.get-record-field-distribution.error',
            description: response.message,
          });
          return { success: false };
        }
        // don't store distribution values in the generic list store (not TBaseEntity)
        // store in cache
        if (cacheAdapter) {
          try {
            await cacheAdapter.set(cacheKey, response.details.values);
          } catch (err) {
            console.warn('cache.set failed', err);
          }
        }

        setItems(response.details.values);
        return { success: true, data: response.details.values };
      } catch (error) {
        console.error(error);
        return { success: false };
      } finally {
        setIsExecuting(false);
      }
    },
    [loggerAdapter, recordAdapter, notifyAdapter, cacheAdapter]
  );

  return {
    execute,
    isExecuting,
    items,
  };
}
