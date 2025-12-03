import { useCallback, useState } from 'react';

import type { IBaseResponse } from '@/domain/core/interface/base-response.interface';
import type {
  IHookResponse,
  IUseHook,
} from '@/domain/core/interface/hook.interface';
import type { INotifyPort } from '@/domain/core/port/notify.port';

interface IAdapterHook<T> {
  getAll: () => Promise<IBaseResponse<{ items: T[] }>>;
}

export function useGetEntityList<EntityDTO>(
  entityName: string,
  notifyAdapter: INotifyPort,
  adapter: IAdapterHook<EntityDTO>
): IUseHook<void, EntityDTO[]> {
  const [isExecuting, setExecuting] = useState<boolean>(false);
  // const [controller] = useState<AbortController>(new AbortController());

  const {
    actions: { saveItems, getItems },
  } = useListStore<EntityDTO>(entityName).getState();

  // const { api } = useAuthApi(controller.signal);

  const execute = useCallback(async (): Promise<IHookResponse<EntityDTO[]>> => {
    const items = getItems();

    if (items.length > 0) {
      return { success: true, data: items };
    }

    setExecuting(true);

    try {
      const response = await adapter.getAll();

      if (!response.success || !response.details) {
        notifyAdapter.error({
          title: `error.get-list-of-${entityName}`,
          message: response.message,
        });

        return { success: false };
      }

      saveItems(response.details.items);

      return { success: true, data: response.details.items };
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

  return { execute, isExecuting };
}
