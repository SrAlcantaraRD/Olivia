import * as Haptics from 'expo-haptics';
import { useCallback, useState } from 'react';
import { Platform } from 'react-native';
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

// FIXME: Should not depend on Uniwind directly. Move to src/ui/themes/app-theme-context.tsx
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

  const toggleTheme = useCallback(() => {
    const newTheme =
      currentTheme === EThemeMode.LIGHT ? EThemeMode.DARK : EThemeMode.LIGHT;

    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    Uniwind.setTheme(newTheme);

    setTheme(newTheme);
  }, [currentTheme]);

  const getLocale = useCallback(async () => {
    const usecase = new GetAppLocaleUseCase(loggerAdapter, cacheAdapter);

    const response = await usecase.execute();

    if (response.success) {
      return response.details;
    }

    return ELocaleCode.es_ES;
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
    toggleTheme,
    isLight: currentTheme === EThemeMode.LIGHT,
    isDark: currentTheme === EThemeMode.DARK,
    getLocale,
    setLocale,
    initSettings,
    isExecuting,
  } as const;
}
