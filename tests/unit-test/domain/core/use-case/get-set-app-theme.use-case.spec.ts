import { CACHE_KEY_ENUM } from '@/domain/core/port/cache.port';
import { GetAppThemeUseCase } from '@/domain/core/use-case/get-app-theme.use-case';
import { SetAppThemeUseCase } from '@/domain/core/use-case/set-app-theme.use-case';
import { mockCachePort, mockLoggerPort } from '../mocks/mock.port';

describe('AppTheme use-cases', () => {
  const prepareSuiteCase = () => {
    const loggerAdapter = mockLoggerPort();
    const cacheAdapter = mockCachePort();

    return { loggerAdapter, cacheAdapter };
  };

  beforeEach(() => jest.clearAllMocks());

  it('GetAppThemeUseCase returns cached theme when present', async () => {
    const { loggerAdapter, cacheAdapter } = prepareSuiteCase();
    cacheAdapter.get.mockResolvedValue('dark');

    const usecase = new GetAppThemeUseCase(loggerAdapter, cacheAdapter);

    const response = await usecase.execute();

    expect(response.success).toBe(true);

    if (response.success) {
      expect(response.details).toBe('dark');
    }
    expect(cacheAdapter.get).toHaveBeenCalledWith(CACHE_KEY_ENUM.APP_THEME);
  });

  it('GetAppThemeUseCase returns default theme when no cached theme', async () => {
    const { loggerAdapter, cacheAdapter } = prepareSuiteCase();
    cacheAdapter.get.mockResolvedValue(null);
    const usecase = new GetAppThemeUseCase(loggerAdapter, cacheAdapter);
    const resp = await usecase.execute();
    expect(resp.success).toBe(true);
    if (resp.success) {
      expect(resp.details).toBe('light');
    }
  });

  it('SetAppThemeUseCase persists theme', async () => {
    const { loggerAdapter, cacheAdapter } = prepareSuiteCase();
    (cacheAdapter.set as jest.Mock).mockResolvedValue(undefined);
    const usecase = new SetAppThemeUseCase(loggerAdapter, cacheAdapter);
    const resp = await usecase.execute({ theme: 'dark' });
    expect(resp.success).toBe(true);
    expect(cacheAdapter.set).toHaveBeenCalledWith(
      CACHE_KEY_ENUM.APP_THEME,
      'dark'
    );
  });
});
