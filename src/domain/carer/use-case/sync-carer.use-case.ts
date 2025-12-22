import {
  RequestSyncWithCarerSchema,
  type TRequestSyncWithCarer,
  type TResponseSyncWithCarer,
} from '@/domain/carer/use-case-schema/sync-carer.use-case-schema';
import type { TLoggerPort } from '@/domain/core/adapter/logger.adapter';
import type { IBaseResponse } from '@/domain/core/interface/base-response.interface';
import { BaseUseCase } from '@/domain/core/interface/base-use-case.interface';
import type { ICachePort } from '@/domain/core/port/cache.port';

export class SyncWithCarerUseCase extends BaseUseCase<
  TRequestSyncWithCarer,
  TResponseSyncWithCarer
> {
  constructor(
    private readonly adapters: {
      loggerAdapter: TLoggerPort;
      cacheAdapter: ICachePort;
    }
  ) {
    super('sync-with-carer', adapters.loggerAdapter);
  }

  public async execute(
    request: TRequestSyncWithCarer
  ): Promise<IBaseResponse<TResponseSyncWithCarer>> {
    this.logDebug('SyncWithCarerUseCase', request);

    const parseResult = RequestSyncWithCarerSchema.safeParse(request);

    if (!parseResult.success) {
      this.logError('SyncWithCarerUseCase', parseResult.error.message);
      return {
        success: false,
        message: 'use-case.sync-with-carer.invalid-request',
      };
    }

    return {
      success: true,
      message: 'common.success',
      details: undefined,
    };
  }
}
