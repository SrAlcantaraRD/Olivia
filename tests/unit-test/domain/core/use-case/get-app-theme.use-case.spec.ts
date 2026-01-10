import { describe, expect, it } from '@jest/globals';

import { CACHE_KEY_ENUM } from '@/domain/core/constant/cache-key.constants';
import { EThemeMode } from '@/domain/core/enum/settings.enum';
import { GetAppThemeUseCase } from '@/domain/core/use-case/get-app-theme.use-case';
import { mockCachePort, mockLoggerPort } from '@/tests/mocks';

describe('[UseCase] - GetAppTheme', () => {
  const prepareSuiteCase = () => {
    const loggerAdapter = mockLoggerPort();
    const cacheAdapter = mockCachePort();

    const unit = new GetAppThemeUseCase(loggerAdapter, cacheAdapter);

    return {
      unit,
      loggerAdapter,
      cacheAdapter,
    };
  };

  beforeEach(() => jest.clearAllMocks());

  describe('Happy Path', () => {
    it('should return cached theme when available', async () => {
      const { unit, cacheAdapter } = prepareSuiteCase();

      cacheAdapter.get.mockResolvedValue(EThemeMode.DARK);

      const result = await unit.execute();

      expect(result.success).toBe(true);
      expect(result.message).toBe('common.success');
      expect(result.details).toBe(EThemeMode.DARK);
      expect(cacheAdapter.get).toHaveBeenCalledWith(CACHE_KEY_ENUM.APP_THEME);
      expect(cacheAdapter.set).not.toHaveBeenCalled();
    });

    it('should set and return default LIGHT theme when cache is empty', async () => {
      const { unit, cacheAdapter } = prepareSuiteCase();

      cacheAdapter.get.mockResolvedValue(null);

      const result = await unit.execute();

      expect(result.success).toBe(true);
      expect(result.message).toBe('common.success');
      expect(result.details).toBe(EThemeMode.LIGHT);
      expect(cacheAdapter.get).toHaveBeenCalledWith(CACHE_KEY_ENUM.APP_THEME);
      expect(cacheAdapter.set).toHaveBeenCalledWith(
        CACHE_KEY_ENUM.APP_THEME,
        EThemeMode.LIGHT
      );
    });
  });

  describe('Error Cases', () => {
    it('should handle cache get error', async () => {
      const { unit, cacheAdapter, loggerAdapter } = prepareSuiteCase();

      const error = new Error('Cache error');
      cacheAdapter.get.mockRejectedValue(error);

      const result = await unit.execute();

      expect(result.success).toBe(false);
      expect(result.message).toBe('common.error');
      expect(loggerAdapter.error).toHaveBeenCalledWith({
        useCase: 'get-app-theme',
        message: 'GetAppThemeUseCase',
        details: error,
      });
    });

    it('should handle cache set error when initializing default theme', async () => {
      const { unit, cacheAdapter, loggerAdapter } = prepareSuiteCase();

      cacheAdapter.get.mockResolvedValue(null);
      const error = new Error('Cache set error');
      cacheAdapter.set.mockRejectedValue(error);

      const result = await unit.execute();

      expect(result.success).toBe(false);
      expect(result.message).toBe('common.error');
      expect(loggerAdapter.error).toHaveBeenCalledWith({
        useCase: 'get-app-theme',
        message: 'GetAppThemeUseCase',
        details: error,
      });
    });
  });
});
