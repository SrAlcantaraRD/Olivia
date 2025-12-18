/// <reference types="jest" />

import { CACHE_KEY_ENUM } from '@/domain/core/constant/cache-key.constants';
import { ELocaleCode } from '@/domain/core/enum/settings.enum';
import { GetAppLocaleUseCase } from '@/domain/core/use-case/get-app-locale.use-case';
import { mockCachePort, mockLoggerPort } from '@/tests/mocks/core.port.mock';

describe('[UseCase] - GetAppLocale', () => {
  const prepareSuiteCase = () => {
    const loggerAdapter = mockLoggerPort();
    const cacheAdapter = mockCachePort();

    const useCase = new GetAppLocaleUseCase(loggerAdapter, cacheAdapter);

    return { useCase, loggerAdapter, cacheAdapter };
  };

  beforeEach(() => jest.clearAllMocks());

  describe('Happy Path', () => {
    it('returns locale from cache if exists', async () => {
      const { useCase, cacheAdapter } = prepareSuiteCase();
      const locale = ELocaleCode.en_EN;
      cacheAdapter.get.mockResolvedValue(locale);

      const response = await useCase.execute();

      expect(response.success).toBe(true);
      expect(response.details).toBe(locale);
      expect(cacheAdapter.get).toHaveBeenCalledWith(CACHE_KEY_ENUM.APP_LOCALE);
      expect(cacheAdapter.set).not.toHaveBeenCalled();
    });

    it('sets default locale and returns it if not in cache', async () => {
      const { useCase, cacheAdapter } = prepareSuiteCase();
      cacheAdapter.get.mockResolvedValue(null);
      cacheAdapter.set.mockResolvedValue(undefined);

      const response = await useCase.execute();

      expect(response.success).toBe(true);
      expect(response.details).toBe(ELocaleCode.es_ES);
      expect(cacheAdapter.get).toHaveBeenCalledWith(CACHE_KEY_ENUM.APP_LOCALE);
      expect(cacheAdapter.set).toHaveBeenCalledWith(
        CACHE_KEY_ENUM.APP_LOCALE,
        ELocaleCode.es_ES
      );
    });
  });

  describe('Negative Path', () => {
    it('returns success false on cache error', async () => {
      const { useCase, cacheAdapter } = prepareSuiteCase();
      cacheAdapter.get.mockRejectedValue(new Error('Cache error'));

      const response = await useCase.execute();

      expect(response.success).toBe(false);
      expect(response.message).toBe('common.error');
      expect(cacheAdapter.get).toHaveBeenCalledWith(CACHE_KEY_ENUM.APP_LOCALE);
    });
  });
});
