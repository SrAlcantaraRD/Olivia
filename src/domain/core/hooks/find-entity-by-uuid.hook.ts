import { useCallback, useState } from 'react';

import type { TBaseEntity } from '@/domain/core/entity/base-entity.entity';
import type { IBaseResponse } from '@/domain/core/interface/base-response.interface';
import type {
  IHookResponse,
  IUseHook,
} from '@/domain/core/interface/hook.interface';
import type { INotifyPort } from '@/domain/core/port/notify.port';
import type { TUUID } from '@/domain/core/schemas/uuid.schema';
import { useByIDStore } from '@/domain/core/stores/by-id.store';

interface IAdapterHook<T> {
  findByUUID: (uuid: TUUID) => Promise<IBaseResponse<{ item: T }>>;
}

export const useFindEntityByUUID = <Entity extends TBaseEntity>(
  entityName: string,
  notifyAdapter: INotifyPort,
  adapter: IAdapterHook<Entity>
): IUseHook<TUUID, Entity> => {
  const [isExecuting, setExecuting] = useState<boolean>(false);
  // const [controller] = useState<AbortController>(new AbortController());

  const {
    actions: { saveItem, getItem },
  } = useByIDStore<Entity>(entityName);
  // const { api } = useAuthApi(controller.signal);

  const execute = useCallback(
    async (uuid: TUUID, reload?: boolean): Promise<IHookResponse<Entity>> => {
      const _item = getItem(uuid);

      if (_item && !reload) {
        return {
          success: true,
          data: _item,
        };
      }

      setExecuting(true);

      try {
        const response = await adapter.findByUUID(uuid);

        if (!response.success || !response.details) {
          notifyAdapter.error({
            title: 'error.on-get-entity-by-id',
            message: response.message,
          });

          return { success: false };
        }

        const item = response.details.item;

        saveItem(item);

        return { success: true, data: item };
      } catch (error) {
        console.error(error);
        return { success: false };
      } finally {
        setExecuting(false);
      }
    },
    []
  );

  // useEffect(() => {
  //   return () => controller.abort();
  // }, []);

  return { execute, isExecuting };
};
