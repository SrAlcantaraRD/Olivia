import { useCallback, useState } from 'react';

import type { IBaseResponse } from '@/domain/core/interface/base-response.interface';
import type {
  IHookResponse,
  IUseHook,
} from '@/domain/core/interface/hook.interface';
import type { INotifyPort } from '@/domain/core/port/notify.port';

interface IAdapterHook<EntityDTO, Entity> {
  create: (dto: EntityDTO) => Promise<IBaseResponse<{ item: Entity }>>;
}

export function useCreateEntity<EntityDTO, Entity>(
  entityName: string,
  notifyAdapter: INotifyPort,
  adapter: IAdapterHook<EntityDTO, Entity>
): IUseHook<EntityDTO, Entity> {
  const [isExecuting, setExecuting] = useState<boolean>(false);
  // const [controller] = useState<AbortController>(new AbortController());

  const execute = useCallback(
    async (dto: EntityDTO): Promise<IHookResponse<Entity>> => {
      setExecuting(true);

      try {
        const response = await adapter.create(dto);

        if (!response.success || !response.details) {
          notifyAdapter.error({
            title: `error.creating-a-${entityName}`,
            message: response.message,
          });

          return { success: false };
        }

        return { success: true, data: response.details.item };
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
}
