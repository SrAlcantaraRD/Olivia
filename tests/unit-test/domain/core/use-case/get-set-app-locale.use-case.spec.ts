import type { TLoggerPort } from '@/domain/core/adapter/logger.adapter';
import type { ICachePort } from '@/domain/core/port/cache.port';
import { CACHE_KEY_ENUM } from '@/domain/core/port/cache.port';
import { GetAppLocaleUseCase } from '@/domain/core/use-case/get-app-locale.use-case';
import { SetAppLocaleUseCase } from '@/domain/core/use-case/set-app-locale.use-case';

function mockLoggerPort(
  overrides?: Partial<Record<keyof TLoggerPort, jest.Mock>>
): jest.Mocked<TLoggerPort> {
  return {
    warn: jest.fn(),
    info: jest.fn(),
    debug: jest.fn(),
    error: jest.fn(),
    custom: jest.fn(),
    setSeverity: jest.fn(),
    devNotice: jest.fn(),
    disable: jest.fn(),
    enable: jest.fn(),
    extend: jest.fn(),
    getExtensions: jest.fn(),
    getSeverity: jest.fn(),
    patchConsole: jest.fn(),
    ...overrides,
  } satisfies jest.Mocked<TLoggerPort>;
}

function mockCachePort(
  overrides?: Partial<Record<keyof ICachePort, jest.Mock>>
): jest.Mocked<ICachePort> {
  return {
    delete: jest.fn().mockResolvedValue(undefined),
    get: jest.fn().mockResolvedValue(null),
    set: jest.fn().mockResolvedValue(undefined),
    clearAll: jest.fn().mockResolvedValue(undefined),
    ...overrides,
  } satisfies jest.Mocked<ICachePort>;
}

describe('AppLocale use-cases', () => {
  const prepareSuiteCase = () => {
    const cachePort = mockCachePort();
    const loggerPort = mockLoggerPort();

    return { cachePort, loggerPort };
  };

  beforeEach(() => jest.clearAllMocks());

  it('GetAppLocaleUseCase returns cached locale when present', async () => {
    const { cachePort, loggerPort } = prepareSuiteCase();
    cachePort.get.mockResolvedValue('es-ES');
    const usecase = new GetAppLocaleUseCase(loggerPort, cachePort);
    const resp = await usecase.execute();
    expect(resp.success).toBe(true);
    if (resp.success) {
      expect(resp.details).toBe('es-ES');
    }
    expect(cachePort.get).toHaveBeenCalledWith(CACHE_KEY_ENUM.APP_LOCALE);
  });

  it('GetAppLocaleUseCase returns default locale when no cached locale', async () => {
    const { cachePort, loggerPort } = prepareSuiteCase();
    cachePort.get.mockResolvedValue(null);
    const usecase = new GetAppLocaleUseCase(loggerPort, cachePort);
    const resp = await usecase.execute();
    expect(resp.success).toBe(true);
    if (resp.success) {
      expect(resp.details).toBe('es-ES');
    }
  });

  it('SetAppLocaleUseCase persists locale', async () => {
    const { cachePort, loggerPort } = prepareSuiteCase();
    cachePort.set.mockResolvedValue(undefined);
    const usecase = new SetAppLocaleUseCase(loggerPort, cachePort);
    const resp = await usecase.execute({ locale: 'ca-CA' });
    expect(resp.success).toBe(true);
    expect(cachePort.set).toHaveBeenCalledWith(
      CACHE_KEY_ENUM.APP_LOCALE,
      'ca-CA'
    );
  });
});
