import { useCallback } from 'react';
import { ScrollView, View } from 'react-native';

import { useAdapters } from '@/adapter';
import { BASE_LOGGER } from '@/domain/core/adapter/logger.adapter';
import { ELocaleCode, EThemeMode } from '@/domain/core/enum/settings.enum';
import { useAppSettings } from '@/domain/core/hook/use-app-settings.hook';
import { ButtonAtom } from '@/ui/components/atoms/button.atom';
import {
  TypographyParagraph,
  TypographyTitle,
} from '@/ui/components/atoms/typography.atom';
import { useAppTheme } from '@/ui/themes/app-theme-context';

export default function AppSettingsScreen() {
  const { cacheAdapter } = useAdapters();
  const { setTheme, setLocale } = useAppSettings({
    loggerAdapter: BASE_LOGGER,
    cacheAdapter,
  });

  const { currentTheme, isDark, isLight } = useAppTheme();

  const onToggleTheme = useCallback(() => {
    const newTheme = isLight ? EThemeMode.DARK : EThemeMode.LIGHT;
    void setTheme(newTheme);
  }, [isLight, setTheme]);

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16 }}
        contentInsetAdjustmentBehavior="automatic"
      >
        <View className="gap-6">
          <TypographyTitle
            i18nKey="page.app_settings.title"
            accessibilityRole="header"
          />

          <View className="p-4 bg-default-100 rounded-lg">
            <TypographyParagraph
              i18nKey="page.app_settings.placeholder"
              variant="light"
              size="sm"
              className="text-center"
            />
          </View>

          {/* Application section */}
          <View className="p-4 bg-default-100 rounded-lg">
            <TypographyTitle i18nKey="page.app_settings.section_theme" />
            <View className="mt-4">
              <ButtonAtom
                onPress={onToggleTheme}
                testID="page.app_settings.button.toggle-theme"
                title={
                  currentTheme === 'dark'
                    ? 'page.app_settings.action.switch_to_light'
                    : 'page.app_settings.action.switch_to_dark'
                }
              />
            </View>
          </View>

          <View className="p-4 bg-default-100 rounded-lg">
            <TypographyTitle i18nKey="page.app_settings.section_language" />
            <View className="mt-4 space-y-2">
              <ButtonAtom
                testID="page.app_settings.button.change-language-english"
                title="page.app_settings.language.english"
                onPress={() => void setLocale(ELocaleCode.EN)}
              />
              <ButtonAtom
                testID="page.app_settings.button.change-language-spanish"
                title="page.app_settings.language.spanish"
                onPress={() => void setLocale(ELocaleCode.ES)}
              />
              <ButtonAtom
                testID="page.app_settings.button.change-language-catalan"
                title="page.app_settings.language.catalan"
                onPress={() => void setLocale(ELocaleCode.CA)}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
