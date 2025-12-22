import type { TLoggerPort } from '@/domain/core/adapter/logger.adapter';
import type { ICachePort } from '@/domain/core/port/cache.port';
import { CACHE_KEY_ENUM } from '@/domain/core/port/cache.port';
import { GetAppLocaleUseCase } from '@/domain/core/use-case/get-app-locale.use-case';
import { SetAppLocaleUseCase } from '@/domain/core/use-case/set-app-locale.use-case';

describe('AppLocale use-cases', () => {
  let mockCacheAdapter: Pick<ICachePort, 'get' | 'set'>;
  const mockLogger = {
    debug: jest.fn(),
    error: jest.fn(),
  } as unknown as TLoggerPort;

  beforeEach(() => {
    mockCacheAdapter = {
      get: jest.fn(),
      set: jest.fn(),
    };
  });

  it('GetAppLocaleUseCase returns cached locale when present', async () => {
    (mockCacheAdapter.get as jest.Mock).mockResolvedValue('es-ES');
    const usecase = new GetAppLocaleUseCase(
      mockLogger,
      mockCacheAdapter as ICachePort
    );
    const resp = await usecase.execute();
    expect(resp.success).toBe(true);
    if (resp.success) {
      expect(resp.details).toBe('es-ES');
    }
    expect(mockCacheAdapter.get).toHaveBeenCalledWith(
      CACHE_KEY_ENUM.APP_LOCALE
    );
  });

  it('GetAppLocaleUseCase returns null when no cached locale', async () => {
    (mockCacheAdapter.get as jest.Mock).mockResolvedValue(null);
    const usecase = new GetAppLocaleUseCase(
      mockLogger,
      mockCacheAdapter as ICachePort
    );
    const resp = await usecase.execute();
    expect(resp.success).toBe(true);
    if (resp.success) {
      expect(resp.details).toBeUndefined();
    }
  });

  it('SetAppLocaleUseCase persists locale', async () => {
    (mockCacheAdapter.set as jest.Mock).mockResolvedValue(undefined);
    const usecase = new SetAppLocaleUseCase(
      mockLogger,
      mockCacheAdapter as ICachePort
    );
    const resp = await usecase.execute({ locale: 'ca-CA' });
    expect(resp.success).toBe(true);
    expect(mockCacheAdapter.set).toHaveBeenCalledWith(
      CACHE_KEY_ENUM.APP_LOCALE,
      'ca-CA'
    );
  });
});
