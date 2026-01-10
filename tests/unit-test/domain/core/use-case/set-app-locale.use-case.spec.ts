import { describe, expect, it } from '@jest/globals';

import { CACHE_KEY_ENUM } from '@/domain/core/constant/cache-key.constants';
import { SetAppLocaleUseCase } from '@/domain/core/use-case/set-app-locale.use-case';
import type { TRequestSetAppLocale } from '@/domain/core/use-case-schema/set-app-locale.use-case-schema';
import { mockCachePort, mockLoggerPort } from '@/tests/mocks';

describe('[UseCase] - SetAppLocale', () => {
  const prepareSuiteCase = () => {
    const loggerAdapter = mockLoggerPort();
    const cacheAdapter = mockCachePort();

    const unit = new SetAppLocaleUseCase(loggerAdapter, cacheAdapter);

    return {
      unit,
      loggerAdapter,
      cacheAdapter,
    };
  };

  beforeEach(() => jest.clearAllMocks());

  describe('Happy Path', () => {
    it('should set locale to English and return success', async () => {
      const { unit, cacheAdapter } = prepareSuiteCase();

      const request: TRequestSetAppLocale = {
        locale: 'en-EN',
      };

      const result = await unit.execute(request);

      expect(result.success).toBe(true);
      expect(result.message).toBe('common.success');
      expect(result.details).toBeUndefined();
      expect(cacheAdapter.set).toHaveBeenCalledWith(
        CACHE_KEY_ENUM.APP_LOCALE,
        'en-EN'
      );
    });

    it('should set locale to Spanish and return success', async () => {
      const { unit, cacheAdapter } = prepareSuiteCase();

      const request: TRequestSetAppLocale = {
        locale: 'es-ES',
      };

      const result = await unit.execute(request);

      expect(result.success).toBe(true);
      expect(result.message).toBe('common.success');
      expect(result.details).toBeUndefined();
      expect(cacheAdapter.set).toHaveBeenCalledWith(
        CACHE_KEY_ENUM.APP_LOCALE,
        'es-ES'
      );
    });

    it('should set locale to Catalan and return success', async () => {
      const { unit, cacheAdapter } = prepareSuiteCase();

      const request: TRequestSetAppLocale = {
        locale: 'ca-CA',
      };

      const result = await unit.execute(request);

      expect(result.success).toBe(true);
      expect(result.message).toBe('common.success');
      expect(result.details).toBeUndefined();
      expect(cacheAdapter.set).toHaveBeenCalledWith(
        CACHE_KEY_ENUM.APP_LOCALE,
        'ca-CA'
      );
    });
  });

  describe('Error Cases', () => {
    it('should handle cache set error', async () => {
      const { unit, cacheAdapter, loggerAdapter } = prepareSuiteCase();

      const error = new Error('Cache set error');
      cacheAdapter.set.mockRejectedValue(error);

      const request: TRequestSetAppLocale = {
        locale: 'en-EN',
      };

      const result = await unit.execute(request);

      expect(result.success).toBe(false);
      expect(result.message).toBe('common.error');
      expect(loggerAdapter.error).toHaveBeenCalledWith({
        useCase: 'set-app-locale',
        message: 'SetAppLocaleUseCase',
        details: error,
      });
    });
  });
});
