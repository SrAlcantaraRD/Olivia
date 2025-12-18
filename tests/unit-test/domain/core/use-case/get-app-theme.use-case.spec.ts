/// <reference types="jest" />

import { CACHE_KEY_ENUM } from '@/domain/core/constant/cache-key.constants';
import { EThemeMode } from '@/domain/core/enum/settings.enum';
import { GetAppThemeUseCase } from '@/domain/core/use-case/get-app-theme.use-case';
import { mockCachePort, mockLoggerPort } from '@/tests/mocks/core.port.mock';

describe('[UseCase] - GetAppTheme', () => {
  const prepareSuiteCase = () => {
    const loggerAdapter = mockLoggerPort();
    const cacheAdapter = mockCachePort();

    const useCase = new GetAppThemeUseCase(loggerAdapter, cacheAdapter);

    return { useCase, loggerAdapter, cacheAdapter };
  };

  beforeEach(() => jest.clearAllMocks());

  describe('Happy Path', () => {
    it('returns theme from cache if exists', async () => {
      const { useCase, cacheAdapter } = prepareSuiteCase();
      const theme = EThemeMode.DARK;
      cacheAdapter.get.mockResolvedValue(theme);

      const response = await useCase.execute();

      expect(response.success).toBe(true);
      expect(response.details).toBe(theme);
      expect(cacheAdapter.get).toHaveBeenCalledWith(CACHE_KEY_ENUM.APP_THEME);
      expect(cacheAdapter.set).not.toHaveBeenCalled();
    });

    it('sets default theme and returns it if not in cache', async () => {
      const { useCase, cacheAdapter } = prepareSuiteCase();
      cacheAdapter.get.mockResolvedValue(null);
      cacheAdapter.set.mockResolvedValue(undefined);

      const response = await useCase.execute();

      expect(response.success).toBe(true);
      expect(response.details).toBe(EThemeMode.LIGHT);
      expect(cacheAdapter.get).toHaveBeenCalledWith(CACHE_KEY_ENUM.APP_THEME);
      expect(cacheAdapter.set).toHaveBeenCalledWith(
        CACHE_KEY_ENUM.APP_THEME,
        EThemeMode.LIGHT
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
      expect(cacheAdapter.get).toHaveBeenCalledWith(CACHE_KEY_ENUM.APP_THEME);
    });
  });
});
