import { act, renderHook } from '@testing-library/react-native';
import { Uniwind } from 'uniwind';

import { ELocaleCode, EThemeMode } from '@/domain/core/enum/settings.enum';
import { useAppSettings } from '@/domain/core/hook/use-app-settings.hook';
import { mockCachePort, mockLoggerPort } from '@/tests/mocks/core.port.mock';
import i18n from '@/ui/i18n/i18n';
import { useAppTheme } from '@/ui/themes/app-theme-context';

describe('[Hook] - UseAppSettings', () => {
  const prepareSuiteCase = () => {
    // Arrange
    const loggerAdapter = mockLoggerPort();
    const cacheAdapter = mockCachePort();
    return { loggerAdapter, cacheAdapter };
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Uniwind, 'setTheme').mockImplementation(() => {});
    (useAppTheme as jest.Mock).mockReturnValue({
      currentTheme: EThemeMode.LIGHT,
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('applies theme and persists when setTheme called', async () => {
    const { loggerAdapter, cacheAdapter } = prepareSuiteCase();

    // Act
    const { result } = renderHook(() =>
      useAppSettings({
        loggerAdapter,
        cacheAdapter,
      })
    );

    await act(async () => {
      await result.current.setTheme(EThemeMode.DARK);
    });

    // Assert
    expect(Uniwind.setTheme).toHaveBeenCalledWith(EThemeMode.DARK);
    expect(cacheAdapter.set).toHaveBeenCalled();
  });

  it('changes language and persists when setLocale called', async () => {
    const { loggerAdapter, cacheAdapter } = prepareSuiteCase();

    // Act
    const { result } = renderHook(() =>
      useAppSettings({
        loggerAdapter,
        cacheAdapter,
      })
    );

    await act(async () => {
      await result.current.setLocale(ELocaleCode.es_ES);
    });

    // Assert
    expect(i18n.changeLanguage).toHaveBeenCalledWith(ELocaleCode.es_ES);
    expect(cacheAdapter.set).toHaveBeenCalled();
  });

  it('persists defaults when initSettings called with empty cache', async () => {
    const { loggerAdapter, cacheAdapter } = prepareSuiteCase();
    cacheAdapter.get.mockResolvedValue(null);
    cacheAdapter.set.mockResolvedValue(undefined);

    // Act
    const { result } = renderHook(() =>
      useAppSettings({
        loggerAdapter,
        cacheAdapter,
      })
    );

    await act(async () => {
      await result.current.initSettings();
    });

    // Assert
    expect(cacheAdapter.set).toHaveBeenCalled();
  });
});
