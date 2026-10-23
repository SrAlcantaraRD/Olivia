import { Separator } from 'heroui-native';
import { View } from 'react-native';

import { useAdapters } from '@/adapter';
import { ELocaleCode } from '@/domain/core/enum/settings.enum';
import { useAppSettings } from '@/domain/core/hook/use-app-settings.hook';
import { ScreenLayout } from '@/ui/components/layouts/screen.layout';
import { RowAction } from '@/ui/components/molecules/row-action.molecule';

export default function AppSettingsScreen() {
  const { cacheAdapter, loggerAdapter } = useAdapters();
  const { isLight, toggleTheme, setLocale } = useAppSettings({
    loggerAdapter,
    cacheAdapter,
  });

  return (
    <ScreenLayout
      testID="screen.app-settings"
      title="page.app-settings.title"
      subtitle="page.app-settings.subtitle"
    >
      <View className="gap-2">
        <RowAction
          iconName={isLight ? 'sunny' : 'moon'}
          title="page.app-settings.section-theme"
          onPress={toggleTheme}
          testID="page.app-settings.button.toggle-theme"
        />

        <Separator className="my-2" />

        <RowAction
          iconName="globe"
          title="page.app-settings.language.english"
          onPress={() => setLocale(ELocaleCode.en_EN)}
          testID="page.app-settings.button.change-language-english"
        />
        <RowAction
          iconName="globe"
          title="page.app-settings.language.spanish"
          onPress={() => void setLocale(ELocaleCode.es_ES)}
          testID="page.app-settings.button.change-language-spanish"
        />
        <RowAction
          iconName="globe"
          title="page.app-settings.language.catalan"
          onPress={() => void setLocale(ELocaleCode.ca_CA)}
          testID="page.app-settings.button.change-language-catalan"
        />
      </View>
    </ScreenLayout>
  );
}
