import { useCallback, useState } from 'react';

import type { ICarerPort } from '@/domain/carer/port/carer.port';
import { SetupParentUseCase } from '@/domain/carer/use-case/setup-parent.use-case';
import type {
  TRequestSetupParent,
  TResponseSetupParent,
} from '@/domain/carer/use-case-schema/setup-parent.use-case-schema';
import type { TLoggerPort } from '@/domain/core/adapter/logger.adapter';
import type {
  IHookResponse,
  IUseHook,
} from '@/domain/core/interface/hook.interface';
import type { INotifyPort } from '@/domain/core/port/notify.port';
import type { IModulePort } from '@/domain/module/port/module.port';
import type { IPatientPort } from '@/domain/patient/port/patient.port';

export function useSetupParent(adapters: {
  loggerAdapter: TLoggerPort;
  notifyAdapter: INotifyPort;
  carerAdapter: ICarerPort;
  patientAdapter: IPatientPort;
  moduleAdapter: IModulePort;
}): IUseHook<TRequestSetupParent, TResponseSetupParent> {
  const [isExecuting, setExecuting] = useState<boolean>(false);

  const {
    loggerAdapter,
    notifyAdapter,
    carerAdapter,
    patientAdapter,
    moduleAdapter,
  } = adapters;

  const execute = useCallback(
    async (
      data: TRequestSetupParent
    ): Promise<IHookResponse<TResponseSetupParent>> => {
      setExecuting(true);
      notifyAdapter.loading({
        title: 'hook.setup-parent.title',
        description: 'hook.setup-parent.description',
      });

      try {
        const usecase = new SetupParentUseCase(
          loggerAdapter,
          carerAdapter,
          patientAdapter,
          moduleAdapter
        );

        const response = await usecase.execute(data);

        if (!response.success) {
          notifyAdapter.error({
            title: 'hook.setup-parent.error-title',
            description: response.message,
          });

          return { success: false };
        }

        notifyAdapter.success({
          title: 'hook.setup-parent.success-title',
          description: response.message,
        });

        return {
          success: true,
          data: response.details,
        };
      } catch (error) {
        console.error(error);
        return { success: false };
      } finally {
        setExecuting(false);
      }
    },
    []
  );

  return { execute, isExecuting };
}
