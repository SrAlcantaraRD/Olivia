import { act, renderHook } from '@testing-library/react-native';
import { Uniwind } from 'uniwind';

import type { TLoggerPort } from '@/domain/core/adapter/logger.adapter';
import { ELocaleCode, EThemeMode } from '@/domain/core/enum/settings.enum';
import { useAppSettings } from '@/domain/core/hook/use-app-settings.hook';
import type { ICachePort } from '@/domain/core/port/cache.port';
import i18n from '@/ui/i18n/i18n';

jest.mock('@/ui/themes/app-theme-context', () => ({
  useAppTheme: () => ({ currentTheme: 'light' }),
}));

describe('useAppSettings hook', () => {
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
    jest.spyOn(Uniwind, 'setTheme').mockImplementation(() => {});
    jest
      .spyOn(i18n, 'changeLanguage')
      .mockImplementation(() => Promise.resolve());
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('setTheme applies theme and persists', async () => {
    const { result } = renderHook(() =>
      useAppSettings({
        loggerAdapter: mockLogger,
        cacheAdapter: mockCacheAdapter as ICachePort,
      })
    );

    await act(async () => {
      await result.current.setTheme(EThemeMode.DARK);
    });

    expect(Uniwind.setTheme).toHaveBeenCalledWith(EThemeMode.DARK);
    expect(
      (mockCacheAdapter.set as jest.Mock).mock.calls.length
    ).toBeGreaterThan(0);
  });

  it('setLocale changes language and persists', async () => {
    const { result } = renderHook(() =>
      useAppSettings({
        loggerAdapter: mockLogger,
        cacheAdapter: mockCacheAdapter as ICachePort,
      })
    );

    await act(async () => {
      await result.current.setLocale(ELocaleCode.ES);
    });

    expect(i18n.changeLanguage).toHaveBeenCalledWith(ELocaleCode.ES);
    expect(
      (mockCacheAdapter.set as jest.Mock).mock.calls.length
    ).toBeGreaterThan(0);
  });

  it('initSettings persists defaults when cache empty', async () => {
    (mockCacheAdapter.get as jest.Mock).mockResolvedValue(null);
    (mockCacheAdapter.set as jest.Mock).mockResolvedValue(undefined);

    const { result } = renderHook(() =>
      useAppSettings({
        loggerAdapter: mockLogger,
        cacheAdapter: mockCacheAdapter as ICachePort,
      })
    );

    await act(async () => {
      await result.current.initSettings();
    });

    expect(
      (mockCacheAdapter.set as jest.Mock).mock.calls.length
    ).toBeGreaterThanOrEqual(1);
  });
});
