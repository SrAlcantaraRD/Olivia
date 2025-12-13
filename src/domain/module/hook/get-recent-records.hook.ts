import { useCallback, useState } from 'react';

import type { TLoggerPort } from '@/domain/core/adapter/logger.adapter';
import type {
  IHookResponse,
  IUseHook,
} from '@/domain/core/interface/hook.interface';
import type { INotifyPort } from '@/domain/core/port/notify.port';
import { useListStore } from '@/domain/core/stores/list.store';
import type { TRecord } from '@/domain/module/entity/record.entity';
import type { IRecordPort } from '@/domain/module/port/record.port';

export function useGetRecentRecords(adapters: {
  loggerAdapter: TLoggerPort;
  recordAdapter: IRecordPort;
  notifyAdapter: INotifyPort;
}): IUseHook<number, TRecord[]> {
  const { recordAdapter, notifyAdapter } = adapters;
  const {
    actions: { getItems, startLoading, stopLoading, isLoading },
  } = useListStore<TRecord>('recent-records');

  const execute = useCallback(
    async (limit = 10): Promise<IHookResponse<TRecord[]>> => {
      startLoading();
      try {
        const all = await recordAdapter.getAll();
        const sorted = (all ?? []).slice().sort((a: TRecord, b: TRecord) => {
          const ta = a.createdAt ? Number(a.createdAt) : 0;
          const tb = b.createdAt ? Number(b.createdAt) : 0;
          return tb - ta;
        });
        const items = sorted.slice(0, limit);
        return { success: true, data: items };
      } catch (_error) {
        notifyAdapter.error({
          title: 'common.error',
          description: 'common.error',
        });
        return { success: false };
      } finally {
        stopLoading();
      }
    },
    [recordAdapter, notifyAdapter]
  );

  return { execute, isExecuting: isLoading(), items: getItems() };
}
