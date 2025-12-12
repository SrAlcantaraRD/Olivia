import type { TLoggerPort } from '@/domain/core/adapter/logger.adapter';
import { CACHE_KEY_ENUM } from '@/domain/core/constant/cache-key.constants';
import { EThemeMode } from '@/domain/core/enum/settings.enum';
import type { IBaseResponse } from '@/domain/core/interface/base-response.interface';
import { BaseUseCase } from '@/domain/core/interface/base-use-case.interface';
import type { ICachePort } from '@/domain/core/port/cache.port';
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

      if (!theme) {
        await this.cacheAdapter.set<TResponseGetAppTheme>(
          CACHE_KEY_ENUM.APP_THEME,
          EThemeMode.LIGHT
        );
      }

      return {
        success: true,
        message: 'common.success',
        details: theme ?? EThemeMode.LIGHT,
      };
    } catch (error) {
      this.logError('GetAppThemeUseCase', error as unknown);
      return {
        success: false,
        message: 'common.error',
      };
    }
  }
}
