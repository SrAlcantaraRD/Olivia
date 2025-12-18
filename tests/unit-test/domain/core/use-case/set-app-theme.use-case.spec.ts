/// <reference types="jest" />

import { CACHE_KEY_ENUM } from '@/domain/core/constant/cache-key.constants';
import { EThemeMode } from '@/domain/core/enum/settings.enum';
import { SetAppThemeUseCase } from '@/domain/core/use-case/set-app-theme.use-case';
import { mockCachePort, mockLoggerPort } from '@/tests/mocks/core.port.mock';

describe('[UseCase] - SetAppTheme', () => {
  const prepareSuiteCase = () => {
    const loggerAdapter = mockLoggerPort();
    const cacheAdapter = mockCachePort();

    const useCase = new SetAppThemeUseCase(loggerAdapter, cacheAdapter);

    return { useCase, loggerAdapter, cacheAdapter };
  };

  beforeEach(() => jest.clearAllMocks());

  describe('Happy Path', () => {
    it('sets theme in cache successfully', async () => {
      const { useCase, cacheAdapter } = prepareSuiteCase();
      const theme = EThemeMode.DARK;
      cacheAdapter.set.mockResolvedValue(undefined);

      const response = await useCase.execute({ theme });

      expect(response.success).toBe(true);
      expect(response.details).toBeUndefined();
      expect(cacheAdapter.set).toHaveBeenCalledWith(
        CACHE_KEY_ENUM.APP_THEME,
        theme
      );
    });
  });

  describe('Negative Path', () => {
    it('returns success false on cache error', async () => {
      const { useCase, cacheAdapter } = prepareSuiteCase();
      const theme = EThemeMode.DARK;
      cacheAdapter.set.mockRejectedValue(new Error('Cache error'));

      const response = await useCase.execute({ theme });

      expect(response.success).toBe(false);
      expect(response.message).toBe('common.error');
      expect(cacheAdapter.set).toHaveBeenCalledWith(
        CACHE_KEY_ENUM.APP_THEME,
        theme
      );
    });
  });
});
