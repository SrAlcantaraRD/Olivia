import type { TLoggerPort } from '@/domain/core/adapter/logger.adapter';
import type { IBaseResponse } from '@/domain/core/interface/base-response.interface';
import { BaseUseCase } from '@/domain/core/interface/base-use-case.interface';
import type { ICachePort } from '@/domain/core/port/cache.port';
import { CACHE_KEY_ENUM } from '@/domain/core/port/cache.port';
import type {
  TRequestSetAppTheme,
  TResponseSetAppTheme,
} from '@/domain/core/use-case-schema/set-app-theme.use-case-schema';

export class SetAppThemeUseCase extends BaseUseCase<
  TRequestSetAppTheme,
  TResponseSetAppTheme
> {
  constructor(
    loggerAdapter: TLoggerPort,
    private readonly cacheAdapter: ICachePort
  ) {
    super('set-app-theme', loggerAdapter);
  }

  public async execute(
    request: TRequestSetAppTheme
  ): Promise<IBaseResponse<TResponseSetAppTheme>> {
    try {
      await this.cacheAdapter.set(CACHE_KEY_ENUM.APP_THEME, request.theme);

      return {
        success: true,
        message: 'common.success',
        details: undefined,
      };
    } catch (error) {
      this.logError('SetAppThemeUseCase', error as unknown);
      return {
        success: false,
        message: 'common.error',
      };
    }
  }
}
