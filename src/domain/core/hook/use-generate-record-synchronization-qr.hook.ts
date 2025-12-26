import { useCallback, useState } from 'react';

import type { TLoggerPort } from '@/domain/core/adapter/logger.adapter';
import type {
  IHookResponse,
  IUseHook,
} from '@/domain/core/interface/hook.interface';
import type { INotifyPort } from '@/domain/core/port/notify.port';
import type { IQRPort } from '@/domain/core/port/qr.port';
import type {
  TRequestGenerateRecordSynchronizationQR,
  TResponseGenerateRecordSynchronizationQR,
} from '@/domain/core/use-case-schema/generate-record-synchronization-qr.use-case-schema';
import { GenerateRecordSynchronizationQRUseCase } from '@/domain/core/use-case/generate-record-synchronization-qr.use-case';
import type { IRecordPort } from '@/domain/module/port/record.port';

export function useGenerateRecordSynchronizationQr(adapters: {
  loggerAdapter: TLoggerPort;
  notifyAdapter: INotifyPort;
  recordAdapter: IRecordPort;
  qrAdapter: IQRPort;
}): IUseHook<
  TRequestGenerateRecordSynchronizationQR,
  TResponseGenerateRecordSynchronizationQR | null
> {
  const [isExecuting, setExecuting] = useState(false);
  const [result, setResult] =
    useState<TResponseGenerateRecordSynchronizationQR | null>(null);

  const execute = useCallback(
    async (
      data: TRequestGenerateRecordSynchronizationQR
    ): Promise<
      IHookResponse<TResponseGenerateRecordSynchronizationQR | null>
    > => {
      setExecuting(true);
      adapters.notifyAdapter.loading({
        title: 'hook.generate-sync-qr.title',
        description: 'hook.generate-sync-qr.description',
      });

      try {
        const useCase = new GenerateRecordSynchronizationQRUseCase({
          loggerAdapter: adapters.loggerAdapter,
          recordAdapter: adapters.recordAdapter,
          qrAdapter: adapters.qrAdapter,
        });

        const response = await useCase.execute(data);

        if (!response.success) {
          adapters.notifyAdapter.error({
            title: 'hook.generate-sync-qr.error-title',
            description: 'hook.generate-sync-qr.error-description',
          });
          return { success: false };
        }

        adapters.notifyAdapter.success({
          title: 'hook.generate-sync-qr.success-title',
          description: 'hook.generate-sync-qr.success-description',
        });

        setResult(response.details);

        return {
          success: true,
          data: response.details,
        };
      } catch (error) {
        adapters.notifyAdapter.error({
          title: 'hook.generate-sync-qr.error-title',
          description: 'hook.generate-sync-qr.error-description',
        });
        adapters.loggerAdapter.error(
          'useGenerateRecordSynchronizationQr',
          error
        );
        return { success: false };
      } finally {
        setExecuting(false);
      }
    },
    [
      adapters.loggerAdapter,
      adapters.notifyAdapter,
      adapters.recordAdapter,
      adapters.qrAdapter,
    ]
  );

  return { execute, isExecuting, items: result };
}
