import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, View } from 'react-native';

import { useAdapters } from '@/adapter';
import { useAddDemoData } from '@/domain/core/hook/add-demo-data.hook';
import { CardAtom } from '@/ui/components/atoms/card.atom';
import { TypographyParagraph } from '@/ui/components/atoms/typography.atom';
import { ScreenLayout } from '@/ui/components/layouts/screen.layout';
import { SettingsRow } from '@/ui/components/molecules/settings-row.molecule';
import { useNavigation } from '@/ui/hook/use-navigation.hook';

export default function SettingsScreen() {
  const { t } = useTranslation();

  const adapters = useAdapters();
  const { navigationAdapter } = adapters;
  const {
    goToAppSettings,
    goToLogOut,
    goToChildProfile,
    goToCarerManagement,
    goToAbout,
  } = useNavigation({ navigationAdapter });

  const { execute: addDemoData } = useAddDemoData(adapters);

  const handleAddDemoData = async () => {
    await addDemoData();
  };

  return (
    <ScreenLayout
      testID="screen.settings"
      title="page.settings.title"
      subtitle="page.settings.subtitle"
    >
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        className="gap-4"
      >
        <View className="gap-4">
          {/* TODO: Añadir avatar del carer logueada y nombre */}
          <View className="gap-2">
            {/* Child Profile Section */}
            <TypographyParagraph
              testID="screen.settings.section_carers"
              i18nKey="page.settings.section-configuration"
              className="font-semibold text-default-400 uppercase"
              accessibilityRole="header"
            />
            <SettingsRow
              iconName="person"
              titleKey="page.settings.child-profile"
              captionKey="page.settings.child-profile-desc"
              onPress={goToChildProfile}
              testID="screen.settings.child-profile"
            />

            <SettingsRow
              iconName="people"
              titleKey="page.settings.manage-carers"
              captionKey="page.settings.manage-carers-desc"
              onPress={goToCarerManagement}
              testID="screen.settings.manage-carers"
            />
          </View>
          <View className="gap-2">
            {/* App Settings Section */}
            <TypographyParagraph
              testID="screen.settings.section-app"
              i18nKey="page.settings.section-app"
              className="font-semibold text-default-400 uppercase"
              accessibilityRole="header"
            />

            <SettingsRow
              iconName="settings"
              titleKey="page.settings.app-settings"
              captionKey="page.settings.app-settings-desc"
              onPress={goToAppSettings}
              testID="screen.settings.app-settings"
              hasDivider
            />

            <SettingsRow
              iconName="add-circle"
              titleKey="page.settings.add-demo-data"
              captionKey="page.settings.add-demo-data-desc"
              onPress={handleAddDemoData}
              testID="screen.settings.add-demo-data"
              hasDivider
            />

            <SettingsRow
              iconName="information-circle"
              titleKey="page.settings.about"
              captionKey="page.settings.about-desc"
              onPress={goToAbout}
              testID="screen.settings.about"
            />
          </View>

          {/* Danger Zone */}
          <CardAtom className="bg-danger/80">
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('a11y.button.logout')}
              accessibilityHint="a11y.hint.logout-action"
              onPress={goToLogOut}
            >
              <View className="flex-row items-center justify-center p-0 bg-transparent h-10">
                <TypographyParagraph
                  testID="screen.settings.logout"
                  i18nKey="page.settings.logout"
                  className="font-semibold text-white"
                />
              </View>
            </Pressable>
          </CardAtom>
        </View>
      </ScrollView>
    </ScreenLayout>
  );
}
