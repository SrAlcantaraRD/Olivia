import { useCallback, useState } from 'react';

import { BASE_LOGGER, type TBaseEntityDTO } from '@/domain/core';
import type {
  IHookResponse,
  IUseHook,
} from '@/domain/core/interface/hook.interface';
import type { INotifyPort } from '@/domain/core/port/notify.port';
import { useListStore } from '@/domain/core/stores/list.store';

interface IAdapterHook<T> {
  getAll: () => Promise<T[]>;
}

export function useGetEntityList<T extends TBaseEntityDTO>(
  entityName: string,
  notifyAdapter: INotifyPort,
  adapter: IAdapterHook<T>
): IUseHook<void, T[]> {
  const [isExecuting, setExecuting] = useState<boolean>(false);
  // const [controller] = useState<AbortController>(new AbortController());

  const {
    actions: { saveItems, getItems },
  } = useListStore<T>(entityName);

  const execute = useCallback(async (): Promise<IHookResponse<T[]>> => {
    const items = getItems();

    BASE_LOGGER.debug(
      `GetEntityList Hook: Fetched ${items.length} items from store for ${entityName}`
    );

    if (items.length > 0) {
      return { success: true, data: items };
    }

    setExecuting(true);

    try {
      const response = await adapter.getAll();

      saveItems(response);

      return { success: true, data: response };
    } catch (error) {
      console.error(error);
      return { success: false };
    } finally {
      setExecuting(false);
    }
  }, []);

  // useEffect(() => {
  //   return () => controller.abort();
  // }, []);

  return { execute, isExecuting, items: getItems() };
}
