import type { TLoggerPort } from '@/domain/core/adapter/logger.adapter';
import type { IBaseResponse } from '@/domain/core/interface/base-response.interface';
import { BaseUseCase } from '@/domain/core/interface/base-use-case.interface';
import type { ICachePort } from '@/domain/core/port/cache.port';
import { CACHE_KEY_ENUM } from '@/domain/core/port/cache.port';
import type {
  TRequestSetAppLocale,
  TResponseSetAppLocale,
} from '@/domain/core/use-case-schema/set-app-locale.use-case-schema';

export class SetAppLocaleUseCase extends BaseUseCase<
  TRequestSetAppLocale,
  TResponseSetAppLocale
> {
  constructor(
    loggerAdapter: TLoggerPort,
    private readonly cacheAdapter: ICachePort
  ) {
    super('set-app-locale', loggerAdapter);
  }

  public async execute(
    request: TRequestSetAppLocale
  ): Promise<IBaseResponse<TResponseSetAppLocale>> {
    try {
      await this.cacheAdapter.set(CACHE_KEY_ENUM.APP_LOCALE, request.locale);

      return {
        success: true,
        message: 'common.success',
        details: undefined,
      };
    } catch (error) {
      this.logError('SetAppLocaleUseCase', error as unknown);
      return {
        success: false,
        message: 'common.error',
        details: undefined,
      };
    }
  }
}
