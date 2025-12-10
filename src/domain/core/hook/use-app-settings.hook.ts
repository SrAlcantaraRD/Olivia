import { useCallback, useState } from 'react';
import { Uniwind } from 'uniwind';

import type { TLoggerPort } from '@/domain/core/adapter/logger.adapter';
import { ELocaleCode, EThemeMode } from '@/domain/core/enum/settings.enum';
import type { ICachePort } from '@/domain/core/port/cache.port';
import { GetAppLocaleUseCase } from '@/domain/core/use-case/get-app-locale.use-case';
import { GetAppThemeUseCase } from '@/domain/core/use-case/get-app-theme.use-case';
import { SetAppLocaleUseCase } from '@/domain/core/use-case/set-app-locale.use-case';
import { SetAppThemeUseCase } from '@/domain/core/use-case/set-app-theme.use-case';
import i18n from '@/ui/i18n/i18n';
import { useAppTheme } from '@/ui/themes/app-theme-context';

export function useAppSettings(adapters: {
  loggerAdapter: TLoggerPort;
  cacheAdapter: ICachePort;
}) {
  const { loggerAdapter, cacheAdapter } = adapters;
  const [isExecuting, setExecuting] = useState(false);
  const { currentTheme } = useAppTheme();

  const getTheme = useCallback(async () => {
    const usecase = new GetAppThemeUseCase(loggerAdapter, cacheAdapter);
    const response = await usecase.execute();
    return response;
  }, [loggerAdapter, cacheAdapter]);

  const setTheme = useCallback(
    async (theme: EThemeMode) => {
      setExecuting(true);
      try {
        // Apply immediately
        Uniwind.setTheme(theme);

        const usecase = new SetAppThemeUseCase(loggerAdapter, cacheAdapter);
        await usecase.execute({ theme });
      } finally {
        setExecuting(false);
      }
    },
    [loggerAdapter, cacheAdapter]
  );

  const getLocale = useCallback(async () => {
    const usecase = new GetAppLocaleUseCase(loggerAdapter, cacheAdapter);
    const response = await usecase.execute();
    return response;
  }, [loggerAdapter, cacheAdapter]);

  const setLocale = useCallback(
    async (locale: ELocaleCode) => {
      setExecuting(true);
      try {
        await i18n.changeLanguage(locale);

        const usecase = new SetAppLocaleUseCase(loggerAdapter, cacheAdapter);
        await usecase.execute({ locale });
      } finally {
        setExecuting(false);
      }
    },
    [loggerAdapter, cacheAdapter]
  );

  const initSettings = useCallback(async () => {
    setExecuting(true);
    try {
      // Theme
      const themeResp = await getTheme();
      const cachedTheme = themeResp.details;
      if (!cachedTheme) {
        // persist current theme as default
        const defaultTheme = (currentTheme as EThemeMode) ?? EThemeMode.LIGHT;
        const setThemeUseCase = new SetAppThemeUseCase(
          loggerAdapter,
          cacheAdapter
        );
        await setThemeUseCase.execute({ theme: defaultTheme });
      } else {
        Uniwind.setTheme(cachedTheme as EThemeMode);
      }

      // Locale
      const localeResp = await getLocale();
      const cachedLocale = localeResp.details;
      if (!cachedLocale) {
        const lang = i18n.language ?? 'en';
        const defaultLocale = ((): ELocaleCode => {
          if (lang.startsWith('es')) return ELocaleCode.ES;
          if (lang.startsWith('ca')) return ELocaleCode.CA;
          return ELocaleCode.EN;
        })();
        const setLocaleUseCase = new SetAppLocaleUseCase(
          loggerAdapter,
          cacheAdapter
        );
        await setLocaleUseCase.execute({ locale: defaultLocale });
      } else {
        await i18n.changeLanguage(cachedLocale as ELocaleCode);
      }
    } finally {
      setExecuting(false);
    }
  }, [getTheme, getLocale, loggerAdapter, cacheAdapter, currentTheme]);

  return {
    getTheme,
    setTheme,
    getLocale,
    setLocale,
    initSettings,
    isExecuting,
  } as const;
}
