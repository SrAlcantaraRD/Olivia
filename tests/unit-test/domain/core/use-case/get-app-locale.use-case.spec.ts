import { describe, expect, it } from '@jest/globals';

import { CACHE_KEY_ENUM } from '@/domain/core/constant/cache-key.constants';
import { ELocaleCode } from '@/domain/core/enum/settings.enum';
import { GetAppLocaleUseCase } from '@/domain/core/use-case/get-app-locale.use-case';
import { mockCachePort, mockLoggerPort } from '@/tests/mocks';

describe('[UseCase] - GetAppLocale', () => {
  const prepareSuiteCase = () => {
    const loggerAdapter = mockLoggerPort();
    const cacheAdapter = mockCachePort();

    const unit = new GetAppLocaleUseCase(loggerAdapter, cacheAdapter);

    return {
      unit,
      loggerAdapter,
      cacheAdapter,
    };
  };

  beforeEach(() => jest.clearAllMocks());

  describe('Happy Path', () => {
    it('should return cached locale when available', async () => {
      const { unit, cacheAdapter } = prepareSuiteCase();

      cacheAdapter.get.mockResolvedValue(ELocaleCode.en_EN);

      const result = await unit.execute();

      expect(result.success).toBe(true);
      expect(result.message).toBe('common.success');
      expect(result.details).toBe(ELocaleCode.en_EN);
      expect(cacheAdapter.get).toHaveBeenCalledWith(CACHE_KEY_ENUM.APP_LOCALE);
      expect(cacheAdapter.set).not.toHaveBeenCalled();
    });

    it('should set and return default Spanish locale when cache is empty', async () => {
      const { unit, cacheAdapter } = prepareSuiteCase();

      cacheAdapter.get.mockResolvedValue(null);

      const result = await unit.execute();

      expect(result.success).toBe(true);
      expect(result.message).toBe('common.success');
      expect(result.details).toBe(ELocaleCode.es_ES);
      expect(cacheAdapter.get).toHaveBeenCalledWith(CACHE_KEY_ENUM.APP_LOCALE);
      expect(cacheAdapter.set).toHaveBeenCalledWith(
        CACHE_KEY_ENUM.APP_LOCALE,
        ELocaleCode.es_ES
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
        useCase: 'get-app-locale',
        message: 'GetAppLocaleUseCase',
        details: error,
      });
    });

    it('should handle cache set error when initializing default locale', async () => {
      const { unit, cacheAdapter, loggerAdapter } = prepareSuiteCase();

      cacheAdapter.get.mockResolvedValue(null);
      const error = new Error('Cache set error');
      cacheAdapter.set.mockRejectedValue(error);

      const result = await unit.execute();

      expect(result.success).toBe(false);
      expect(result.message).toBe('common.error');
      expect(loggerAdapter.error).toHaveBeenCalledWith({
        useCase: 'get-app-locale',
        message: 'GetAppLocaleUseCase',
        details: error,
      });
    });
  });
});
