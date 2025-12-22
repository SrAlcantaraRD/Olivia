/// <reference types="jest" />

import { CACHE_KEY_ENUM } from '@/domain/core/constant/cache-key.constants';
import { ELocaleCode } from '@/domain/core/enum/settings.enum';
import { SetAppLocaleUseCase } from '@/domain/core/use-case/set-app-locale.use-case';
import { mockCachePort, mockLoggerPort } from '@/tests/mocks/core.port.mock';

describe('[UseCase] - SetAppLocale', () => {
  const prepareSuiteCase = () => {
    const loggerAdapter = mockLoggerPort();
    const cacheAdapter = mockCachePort();

    const useCase = new SetAppLocaleUseCase(loggerAdapter, cacheAdapter);

    return { useCase, loggerAdapter, cacheAdapter };
  };

  beforeEach(() => jest.clearAllMocks());

  describe('Happy Path', () => {
    it('sets locale in cache successfully', async () => {
      const { useCase, cacheAdapter } = prepareSuiteCase();
      const locale = ELocaleCode.en_EN;
      cacheAdapter.set.mockResolvedValue(undefined);

      const response = await useCase.execute({ locale });

      expect(response.success).toBe(true);
      expect(cacheAdapter.set).toHaveBeenCalledWith(
        CACHE_KEY_ENUM.APP_LOCALE,
        locale
      );
    });
  });

  describe('Negative Path', () => {
    it('returns success false on cache error', async () => {
      const { useCase, cacheAdapter } = prepareSuiteCase();
      const locale = ELocaleCode.en_EN;
      cacheAdapter.set.mockRejectedValue(new Error('Cache error'));

      const response = await useCase.execute({ locale });

      expect(response.success).toBe(false);
      expect(response.message).toBe('common.error');
      expect(cacheAdapter.set).toHaveBeenCalledWith(
        CACHE_KEY_ENUM.APP_LOCALE,
        locale
      );
    });
  });
});
