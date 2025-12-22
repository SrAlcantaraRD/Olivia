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

    if (response.success) {
      return response.details;
    }

    return EThemeMode.LIGHT;
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

    if (response.success) {
      return response.details;
    }

    return ELocaleCode.ES;
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
      const cachedTheme = await getTheme();

      Uniwind.setTheme(cachedTheme);

      // Locale
      const cachedLocale = await getLocale();

      await i18n.changeLanguage(cachedLocale);
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
