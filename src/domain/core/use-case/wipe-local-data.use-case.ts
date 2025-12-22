import { dropDatabase } from '@/database/config/drop-database.config';
import type { TLoggerPort } from '@/domain/core/adapter/logger.adapter';
import type { IBaseResponse } from '@/domain/core/interface/base-response.interface';
import { BaseUseCase } from '@/domain/core/interface/base-use-case.interface';
import type { ICachePort } from '@/domain/core/port/cache.port';

export class WipeLocalDataUseCase extends BaseUseCase<undefined, undefined> {
  constructor(
    loggerAdapter: TLoggerPort,
    private readonly cacheAdapter: ICachePort,
    private readonly secureStoreAdapter: ICachePort
  ) {
    super('wipe-local-data', loggerAdapter);
  }

  public async execute(): Promise<IBaseResponse<undefined>> {
    try {
      await this.cacheAdapter.clearAll();

      await this.secureStoreAdapter.clearAll();

      // Finally drop database tables
      await dropDatabase();

      return {
        success: true,
        message: 'common.success',
      };
    } catch (error) {
      this.logError('WipeLocalDataUseCase', error as unknown);
      return {
        success: false,
        message: 'common.error',
      };
    }
  }
}
