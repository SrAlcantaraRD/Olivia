import { useCallback } from 'react';

import { BASE_LOGGER } from '@/domain/core/adapter/logger.adapter';
import type { TBaseEntity } from '@/domain/core/entity/base-entity.entity';
import type {
  IHookResponse,
  IUseHook,
} from '@/domain/core/interface/hook.interface';
import type { INotifyPort } from '@/domain/core/port/notify.port';
import { useListStore } from '@/domain/core/stores/list.store';

interface IAdapterHook<T> {
  getAll: () => Promise<T[]>;
}

export function useGetEntityList<T extends TBaseEntity>(
  entityName: string,
  notifyAdapter: INotifyPort,
  adapter: IAdapterHook<T>
): IUseHook<void, T[]> {
  const {
    actions: { saveItems, getItems, isLoading, startLoading, stopLoading },
  } = useListStore<T>(entityName);

  const execute = useCallback(async (): Promise<IHookResponse<T[]>> => {
    startLoading();

    const items = getItems();

    BASE_LOGGER.debug(
      `GetEntityList Hook: Fetched ${items.length} items from store for ${entityName}`
    );

    if (items.length > 0) {
      return { success: true, data: items };
    }

    try {
      const response = await adapter.getAll();

      saveItems(response);

      return { success: true, data: response };
    } catch (error) {
      console.error(error);
      return { success: false };
    } finally {
      stopLoading();
    }
  }, []);

  // useEffect(() => {
  //   return () => controller.abort();
  // }, []);

  return { execute, isExecuting: isLoading(), items: getItems() };
}
