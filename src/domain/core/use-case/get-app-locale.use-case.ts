import type { TLoggerPort } from '@/domain/core/adapter/logger.adapter';
import type { IBaseResponse } from '@/domain/core/interface/base-response.interface';
import { BaseUseCase } from '@/domain/core/interface/base-use-case.interface';
import type { ICachePort } from '@/domain/core/port/cache.port';
import { CACHE_KEY_ENUM } from '@/domain/core/port/cache.port';
import type {
  TRequestGetAppLocale,
  TResponseGetAppLocale,
} from '@/domain/core/use-case-schema/get-app-locale.use-case-schema';

export class GetAppLocaleUseCase extends BaseUseCase<
  TRequestGetAppLocale,
  TResponseGetAppLocale
> {
  constructor(
    loggerAdapter: TLoggerPort,
    private readonly cacheAdapter: ICachePort
  ) {
    super('get-app-locale', loggerAdapter);
  }

  public async execute(): Promise<IBaseResponse<TResponseGetAppLocale>> {
    try {
      const locale = await this.cacheAdapter.get<TResponseGetAppLocale>(
        CACHE_KEY_ENUM.APP_LOCALE
      );

      return {
        success: true,
        message: 'common.success',
        details: (locale ?? null) as TResponseGetAppLocale,
      };
    } catch (error) {
      this.logError('GetAppLocaleUseCase', error as unknown);
      return {
        success: false,
        message: 'common.error',
        details: null,
      };
    }
  }
}
