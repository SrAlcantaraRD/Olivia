import { describe, expect, it } from '@jest/globals';

import { CACHE_KEY_ENUM } from '@/domain/core/constant/cache-key.constants';
import { SetAppThemeUseCase } from '@/domain/core/use-case/set-app-theme.use-case';
import type { TRequestSetAppTheme } from '@/domain/core/use-case-schema/set-app-theme.use-case-schema';
import { mockCachePort, mockLoggerPort } from '@/tests/mocks';

describe('[UseCase] - SetAppTheme', () => {
  const prepareSuiteCase = () => {
    const loggerAdapter = mockLoggerPort();
    const cacheAdapter = mockCachePort();

    const unit = new SetAppThemeUseCase(loggerAdapter, cacheAdapter);

    return {
      unit,
      loggerAdapter,
      cacheAdapter,
    };
  };

  beforeEach(() => jest.clearAllMocks());

  describe('Happy Path', () => {
    it('should set theme to light and return success', async () => {
      const { unit, cacheAdapter } = prepareSuiteCase();

      const request: TRequestSetAppTheme = {
        theme: 'light',
      };

      const result = await unit.execute(request);

      expect(result.success).toBe(true);
      expect(result.message).toBe('common.success');
      expect(result.details).toBeUndefined();
      expect(cacheAdapter.set).toHaveBeenCalledWith(
        CACHE_KEY_ENUM.APP_THEME,
        'light'
      );
    });

    it('should set theme to dark and return success', async () => {
      const { unit, cacheAdapter } = prepareSuiteCase();

      const request: TRequestSetAppTheme = {
        theme: 'dark',
      };

      const result = await unit.execute(request);

      expect(result.success).toBe(true);
      expect(result.message).toBe('common.success');
      expect(result.details).toBeUndefined();
      expect(cacheAdapter.set).toHaveBeenCalledWith(
        CACHE_KEY_ENUM.APP_THEME,
        'dark'
      );
    });
  });

  describe('Error Cases', () => {
    it('should handle cache set error', async () => {
      const { unit, cacheAdapter, loggerAdapter } = prepareSuiteCase();

      const error = new Error('Cache set error');
      cacheAdapter.set.mockRejectedValue(error);

      const request: TRequestSetAppTheme = {
        theme: 'light',
      };

      const result = await unit.execute(request);

      expect(result.success).toBe(false);
      expect(result.message).toBe('common.error');
      expect(loggerAdapter.error).toHaveBeenCalledWith({
        useCase: 'set-app-theme',
        message: 'SetAppThemeUseCase',
        details: error,
      });
    });
  });
});
