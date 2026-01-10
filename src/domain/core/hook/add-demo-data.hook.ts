import { useCallback, useState } from 'react';

import type { ICarerPort } from '@/domain/carer/port/carer.port';
import type { TLoggerPort } from '@/domain/core/adapter/logger.adapter';
import type {
  IHookResponse,
  IUseHook,
} from '@/domain/core/interface/hook.interface';
import type { INotifyPort } from '@/domain/core/port/notify.port';
import type { IModulePort } from '@/domain/module/port/module.port';
import type { IModuleFieldPort } from '@/domain/module/port/module-field.port';
import type { IRecordPort } from '@/domain/module/port/record.port';
import type { IRecordFieldPort } from '@/domain/module/port/record-field.port';
import { AddDemoDataUseCase } from '@/domain/module/use-case/add-demo-data.use-case';
import type {
  TRequestAddDemoData,
  TResponseAddDemoData,
} from '@/domain/module/use-case-schema/add-demo-data.use-case-schema';

export function useAddDemoData(adapters: {
  loggerAdapter: TLoggerPort;
  notifyAdapter: INotifyPort;
  carerAdapter: ICarerPort;
  moduleAdapter: IModulePort;
  moduleFieldAdapter: IModuleFieldPort;
  recordAdapter: IRecordPort;
  recordFieldAdapter: IRecordFieldPort;
}): IUseHook<TRequestAddDemoData, TResponseAddDemoData> {
  const [isExecuting, setIsExecuting] = useState(false);

  const execute = useCallback(
    async (
      data: TRequestAddDemoData
    ): Promise<IHookResponse<TResponseAddDemoData>> => {
      setIsExecuting(true);
      try {
        const useCase = new AddDemoDataUseCase(adapters);

        const response = await useCase.execute(data);

        if (!response.success) {
          adapters.notifyAdapter.error({
            title: 'hook.add-demo-data.error-title',
            description: response.message,
          });
          return { success: false };
        }

        adapters.notifyAdapter.success({
          title: 'hook.add-demo-data.success-title',
          description: 'hook.add-demo-data.success-description',
        });

        return { success: true, data: response.details };
      } catch (_error) {
        adapters.loggerAdapter.error('Error in useAddDemoData hook', _error);
        adapters.notifyAdapter.error({
          title: 'hook.add-demo-data.error-title',
          description: 'hook.add-demo-data.error-description',
        });
        return { success: false };
      } finally {
        setIsExecuting(false);
      }
    },
    [adapters]
  );

  return { execute, isExecuting, items: void 0 };
}
