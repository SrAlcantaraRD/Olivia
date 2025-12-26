import { useCallback, useState } from 'react';

import type { TLoggerPort } from '@/domain/core/adapter/logger.adapter';
import type {
  IHookResponse,
  IUseHook,
} from '@/domain/core/interface/hook.interface';
import type { INotifyPort } from '@/domain/core/port/notify.port';
import type { IQRPort } from '@/domain/core/port/qr.port';
import type {
  TRequestConsumeRecordSynchronizationQR,
  TResponseConsumeRecordSynchronizationQR,
} from '@/domain/core/use-case-schema/consume-record-synchronization-qr.use-case-schema';
import { ConsumeRecordSynchronizationQRUseCase } from '@/domain/core/use-case/consume-record-synchronization-qr.use-case';
import type { IRecordFieldPort } from '@/domain/module/port/record-field.port';
import type { IRecordPort } from '@/domain/module/port/record.port';

export function useConsumeRecordSynchronizationQr(adapters: {
  loggerAdapter: TLoggerPort;
  notifyAdapter: INotifyPort;
  recordAdapter: IRecordPort;
  recordFieldAdapter: IRecordFieldPort;
  qrAdapter: IQRPort;
}): IUseHook<
  TRequestConsumeRecordSynchronizationQR,
  TResponseConsumeRecordSynchronizationQR | null
> {
  const [isExecuting, setExecuting] = useState(false);
  const [result, setResult] =
    useState<TResponseConsumeRecordSynchronizationQR | null>(null);

  const execute = useCallback(
    async (
      data: TRequestConsumeRecordSynchronizationQR
    ): Promise<
      IHookResponse<TResponseConsumeRecordSynchronizationQR | null>
    > => {
      setExecuting(true);

      adapters.notifyAdapter.loading({
        title: 'hook.consume-sync-qr.title',
        description: 'hook.consume-sync-qr.description',
      });

      try {
        const useCase = new ConsumeRecordSynchronizationQRUseCase({
          loggerAdapter: adapters.loggerAdapter,
          recordAdapter: adapters.recordAdapter,
          recordFieldAdapter: adapters.recordFieldAdapter,
          qrAdapter: adapters.qrAdapter,
        });

        const response = await useCase.execute(data);

        if (!response.success) {
          adapters.notifyAdapter.error({
            title: 'hook.consume-sync-qr.error-title',
            description: 'hook.consume-sync-qr.error-description',
          });
          return { success: false };
        }

        adapters.notifyAdapter.success({
          title: 'hook.consume-sync-qr.success-title',
          description: 'hook.consume-sync-qr.success-description',
        });

        setResult(response.details);

        return {
          success: true,
          data: response.details,
        };
      } catch (error) {
        adapters.notifyAdapter.error({
          title: 'hook.consume-sync-qr.error-title',
          description: 'hook.consume-sync-qr.error-description',
        });
        adapters.loggerAdapter.error(
          'useConsumeRecordSynchronizationQr',
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
      adapters.recordFieldAdapter,
      adapters.qrAdapter,
    ]
  );

  return { execute, isExecuting, items: result };
}
