import { useCallback } from 'react';
import { View } from 'react-native';

import { useAdapters } from '@/adapter';
import { BASE_LOGGER } from '@/domain/core/adapter/logger.adapter';
import { ELocaleCode, EThemeMode } from '@/domain/core/enum/settings.enum';
import { useAppSettings } from '@/domain/core/hook/use-app-settings.hook';
import { CardAtom } from '@/ui/components/atoms/card.atom';
import { ScreenLayout } from '@/ui/components/layouts/screen.layout';
import { SettingsRow } from '@/ui/components/molecules/settings-row.molecule';
import { useAppTheme } from '@/ui/themes/app-theme-context';

export default function AppSettingsScreen() {
  const { cacheAdapter } = useAdapters();
  const { setTheme, setLocale } = useAppSettings({
    loggerAdapter: BASE_LOGGER,
    cacheAdapter,
  });

  const { currentTheme, isLight } = useAppTheme();

  const onToggleTheme = useCallback(() => {
    const newTheme = isLight ? EThemeMode.DARK : EThemeMode.LIGHT;
    void setTheme(newTheme);
  }, [isLight, setTheme]);

  return (
    <ScreenLayout
      testID="screen.app-settings"
      title="page.app_settings.title"
      subtitle="page.app_settings.subtitle"
    >
      <View className="gap-12">
        {/* Theme */}
        <CardAtom>
          <SettingsRow
            iconName={isLight ? 'sunny' : 'moon'}
            titleKey="page.app_settings.section_theme"
            captionKey={
              currentTheme === 'dark'
                ? 'page.app_settings.action.switch_to_light'
                : 'page.app_settings.action.switch_to_dark'
            }
            onPress={onToggleTheme}
            testID="page.app_settings.button.toggle-theme"
          />
        </CardAtom>

        {/* Language */}
        <CardAtom>
          <SettingsRow
            iconName="globe"
            titleKey="page.app_settings.language.english"
            onPress={() => void setLocale(ELocaleCode.EN)}
            testID="page.app-settings.button.change-language-english"
            hasDivider
          />
          <SettingsRow
            iconName="globe"
            titleKey="page.app_settings.language.spanish"
            onPress={() => void setLocale(ELocaleCode.ES)}
            testID="page.app-settings.button.change-language-spanish"
            hasDivider
          />
          <SettingsRow
            iconName="globe"
            titleKey="page.app_settings.language.catalan"
            onPress={() => void setLocale(ELocaleCode.CA)}
            testID="page.app-settings.button.change-language-catalan"
          />
        </CardAtom>
      </View>
    </ScreenLayout>
  );
}
