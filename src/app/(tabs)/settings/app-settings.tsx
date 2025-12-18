import { View } from 'react-native';

import { useAdapters } from '@/adapter';
import { ELocaleCode } from '@/domain/core/enum/settings.enum';
import { useAppSettings } from '@/domain/core/hook/use-app-settings.hook';
import { CardAtom } from '@/ui/components/atoms/card.atom';
import { ScreenLayout } from '@/ui/components/layouts/screen.layout';
import { SettingsRow } from '@/ui/components/molecules/settings-row.molecule';

export default function AppSettingsScreen() {
  const { cacheAdapter, loggerAdapter } = useAdapters();
  const { isLight, isDark, toggleTheme, setLocale } = useAppSettings({
    loggerAdapter,
    cacheAdapter,
  });

  return (
    <ScreenLayout
      testID="screen.app-settings"
      title="page.app-settings.title"
      subtitle="page.app-settings.subtitle"
    >
      <View className="gap-12">
        {/* Theme */}
        <CardAtom>
          <SettingsRow
            iconName={isLight ? 'sunny' : 'moon'}
            titleKey="page.app-settings.section-theme"
            captionKey={
              isDark
                ? 'page.app-settings.action.switch-to-light'
                : 'page.app-settings.action.switch-to-dark'
            }
            onPress={toggleTheme}
            testID="page.app-settings.button.toggle-theme"
          />
        </CardAtom>

        {/* Language */}
        <CardAtom>
          <SettingsRow
            iconName="globe"
            titleKey="page.app-settings.language.english"
            onPress={() => void setLocale(ELocaleCode.en_EN)}
            testID="page.app-settings.button.change-language-english"
            hasDivider
          />
          <SettingsRow
            iconName="globe"
            titleKey="page.app-settings.language.spanish"
            onPress={() => void setLocale(ELocaleCode.es_ES)}
            testID="page.app-settings.button.change-language-spanish"
            hasDivider
          />
          <SettingsRow
            iconName="globe"
            titleKey="page.app-settings.language.catalan"
            onPress={() => void setLocale(ELocaleCode.ca_CA)}
            testID="page.app-settings.button.change-language-catalan"
          />
        </CardAtom>
      </View>
    </ScreenLayout>
  );
}
