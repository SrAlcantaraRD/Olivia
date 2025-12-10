import type { ICachePort } from '@/domain/core/port/cache.port';
import { CACHE_KEY_ENUM } from '@/domain/core/port/cache.port';
import { GetAppThemeUseCase } from '@/domain/core/use-case/get-app-theme.use-case';
import { SetAppThemeUseCase } from '@/domain/core/use-case/set-app-theme.use-case';
import { mockCachePort, mockLoggerPort } from '../../mocks/mock.port';

describe('AppTheme use-cases', () => {
  let mockCacheAdapter: jest.Mocked<Pick<ICachePort, 'get' | 'set' | 'delete'>>;
  const mockLogger = mockLoggerPort();

  beforeEach(() => {
    mockCacheAdapter = mockCachePort();
  });

  it('GetAppThemeUseCase returns cached theme when present', async () => {
    (mockCacheAdapter.get as jest.Mock).mockResolvedValue('dark');
    const usecase = new GetAppThemeUseCase(
      mockLogger,
      mockCacheAdapter as ICachePort
    );
    const resp = await usecase.execute();
    expect(resp.success).toBe(true);
    expect(resp.details).toBe('dark');
    expect(mockCacheAdapter.get).toHaveBeenCalledWith(CACHE_KEY_ENUM.APP_THEME);
  });

  it('GetAppThemeUseCase returns null when no cached theme', async () => {
    (mockCacheAdapter.get as jest.Mock).mockResolvedValue(null);
    const usecase = new GetAppThemeUseCase(
      mockLogger,
      mockCacheAdapter as ICachePort
    );
    const resp = await usecase.execute();
    expect(resp.success).toBe(true);
    expect(resp.details).toBeNull();
  });

  it('SetAppThemeUseCase persists theme', async () => {
    (mockCacheAdapter.set as jest.Mock).mockResolvedValue(undefined);
    const usecase = new SetAppThemeUseCase(
      mockLogger,
      mockCacheAdapter as ICachePort
    );
    const resp = await usecase.execute({ theme: 'dark' });
    expect(resp.success).toBe(true);
    expect(mockCacheAdapter.set).toHaveBeenCalledWith(
      CACHE_KEY_ENUM.APP_THEME,
      'dark'
    );
  });
});
