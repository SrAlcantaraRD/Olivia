import { useCallback } from 'react';

import type { TLoggerPort } from '@/domain/core/adapter/logger.adapter';
import type {
  IHookResponse,
  IUseHook,
} from '@/domain/core/interface/hook.interface';
import type { INotifyPort } from '@/domain/core/port/notify.port';
import { useListStore } from '@/domain/core/stores/list.store';
import type { TModuleField } from '@/domain/module/entity/module-field.entity';
import type { TModule } from '@/domain/module/entity/module.entity';
import type { IModuleFieldPort } from '@/domain/module/port/module-field.port';
import type { TRequestGetModuleFieldList } from '@/domain/module/use-case-schema/get-module-field-list.use-case-schema';
import { GetModuleFieldListUseCase } from '@/domain/module/use-case/get-module-field-list.use-case';

export function useGetListModuleField(adapters: {
  loggerAdapter: TLoggerPort;
  moduleFieldAdapter: IModuleFieldPort;
  notifyAdapter: INotifyPort;
}): IUseHook<TRequestGetModuleFieldList, TModuleField[]> {
  const {
    actions: { saveItems, getItems, isLoading, startLoading, stopLoading },
  } = useListStore<TModuleField>('module-field');

  const { loggerAdapter, moduleFieldAdapter, notifyAdapter } = adapters;

  const execute = useCallback(
    async (
      data: TRequestGetModuleFieldList
    ): Promise<IHookResponse<TModuleField[]>> => {
      startLoading();

      try {
        const useCase = new GetModuleFieldListUseCase({
          loggerAdapter,
          moduleFieldAdapter,
        });

        const response = await useCase.execute(data);

        if (!response.success) {
          notifyAdapter.error({
            title: 'hook.get-list-module-field.error-title',
            description: response.message,
          });

          return { success: false };
        }

        // Ensure items include the module reference expected by the domain type
        const itemsWithModule: TModuleField[] = response.details.items.map(
          (item) =>
            ({
              ...item,
              module: { id: data.moduleId } as TModule,
            }) as unknown as TModuleField
        );

        saveItems(itemsWithModule);

        return { success: true, data: itemsWithModule };
      } catch (error) {
        console.error(error);
        return { success: false };
      } finally {
        stopLoading();
      }
    },
    [loggerAdapter, moduleFieldAdapter, notifyAdapter]
  );

  return {
    execute,
    isExecuting: isLoading(),
    items: getItems() ?? [],
  };
}
