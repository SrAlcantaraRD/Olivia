import type { TLoggerPort } from '@/domain/core/adapter/logger.adapter';
import { CACHE_KEY_ENUM } from '@/domain/core/constant/cache-key.constants';
import { ELocaleCode } from '@/domain/core/enum/settings.enum';
import type { IBaseResponse } from '@/domain/core/interface/base-response.interface';
import { BaseUseCase } from '@/domain/core/interface/base-use-case.interface';
import type { ICachePort } from '@/domain/core/port/cache.port';
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

      if (!locale) {
        await this.cacheAdapter.set<TResponseGetAppLocale>(
          CACHE_KEY_ENUM.APP_LOCALE,
          ELocaleCode.ES
        );
      }

      return {
        success: true,
        message: 'common.success',
        details: locale ?? ELocaleCode.ES,
      };
    } catch (error) {
      this.logError('GetAppLocaleUseCase', error as unknown);
      return {
        success: false,
        message: 'common.error',
      };
    }
  }
}
