import { dropDatabase } from '@/database/config/drop-database.config';
import type { TLoggerPort } from '@/domain/core/adapter/logger.adapter';
import type { IBaseResponse } from '@/domain/core/interface/base-response.interface';
import { BaseUseCase } from '@/domain/core/interface/base-use-case.interface';
import type { ICachePort, TCacheKey } from '@/domain/core/port/cache.port';
import { CACHE_KEY_ENUM } from '@/domain/core/port/cache.port';

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
      // Delete known cache keys
      const keys = Object.values(CACHE_KEY_ENUM) as TCacheKey[];
      await Promise.all(
        keys.map(async (k) => {
          try {
            await this.cacheAdapter.delete(String(k));
          } catch (err) {
            // ignore individual failures
          }
        })
      );

      // Also try secure store adapter for same keys
      await Promise.all(
        keys.map(async (k) => {
          try {
            await this.secureStoreAdapter.delete(String(k));
          } catch (err) {
            // ignore
          }
        })
      );

      // Finally drop database tables
      try {
        await dropDatabase();
      } catch (err) {
        // ignore
      }

      return {
        success: true,
        message: 'common.success',
        details: undefined,
      };
    } catch (error) {
      this.logError('WipeLocalDataUseCase', error as unknown);
      return {
        success: false,
        message: 'common.error',
        details: undefined,
      };
    }
  }
}
