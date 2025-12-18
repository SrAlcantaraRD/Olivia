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

    const adapters = { loggerAdapter, cacheAdapter };

    const { result } = renderHook(() => useAppSettings(adapters));

    const setTheme = async (theme: EThemeMode) => {
      await act(async () => {
        await result.current.setTheme(theme);
      });
    };

    const setLocale = async (locale: ELocaleCode) => {
      await act(async () => {
        await result.current.setLocale(locale);
      });
    };

    const initSettings = async () => {
      await act(async () => {
        await result.current.initSettings();
      });
    };

    return { result, setTheme, setLocale, initSettings, ...adapters };
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
    const { setTheme, cacheAdapter } = prepareSuiteCase();

    // Act
    await setTheme(EThemeMode.DARK);

    // Assert
    expect(Uniwind.setTheme).toHaveBeenCalledWith(EThemeMode.DARK);
    expect(cacheAdapter.set).toHaveBeenCalled();
  });

  it('changes language and persists when setLocale called', async () => {
    const { setLocale, cacheAdapter } = prepareSuiteCase();

    // Act
    await setLocale(ELocaleCode.es_ES);

    // Assert
    expect(i18n.changeLanguage).toHaveBeenCalledWith(ELocaleCode.es_ES);
    expect(cacheAdapter.set).toHaveBeenCalled();
  });

  it('persists defaults when initSettings called with empty cache', async () => {
    const { initSettings, cacheAdapter } = prepareSuiteCase();
    cacheAdapter.get.mockResolvedValue(null);
    cacheAdapter.set.mockResolvedValue(undefined);

    // Act
    await initSettings();

    // Assert
    expect(cacheAdapter.set).toHaveBeenCalled();
  });
});
