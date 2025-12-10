import type { TLoggerPort } from '@/domain/core/adapter/logger.adapter';
import type { IBaseResponse } from '@/domain/core/interface/base-response.interface';
import { BaseUseCase } from '@/domain/core/interface/base-use-case.interface';
import type { ICachePort } from '@/domain/core/port/cache.port';
import { CACHE_KEY_ENUM } from '@/domain/core/port/cache.port';
import type {
  TRequestGetAppTheme,
  TResponseGetAppTheme,
} from '@/domain/core/use-case-schema/get-app-theme.use-case-schema';

export class GetAppThemeUseCase extends BaseUseCase<
  TRequestGetAppTheme,
  TResponseGetAppTheme
> {
  constructor(
    loggerAdapter: TLoggerPort,
    private readonly cacheAdapter: ICachePort
  ) {
    super('get-app-theme', loggerAdapter);
  }

  public async execute(): Promise<IBaseResponse<TResponseGetAppTheme>> {
    try {
      const theme = await this.cacheAdapter.get<TResponseGetAppTheme>(
        CACHE_KEY_ENUM.APP_THEME
      );

      return {
        success: true,
        message: 'common.success',
        details: (theme ?? null) as TResponseGetAppTheme,
      };
    } catch (error) {
      this.logError('GetAppThemeUseCase', error as unknown);
      return {
        success: false,
        message: 'common.error',
        details: null,
      };
    }
  }
}
