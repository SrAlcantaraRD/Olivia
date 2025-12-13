import { Pressable, ScrollView, View } from 'react-native';

import { useAdapters } from '@/adapter';
import { useNavigation } from '@/hooks/use-navigation.hook';
import { CardAtom } from '@/ui/components/atoms/card.atom';
import { TypographyParagraph } from '@/ui/components/atoms/typography.atom';
import { ScreenLayout } from '@/ui/components/layouts/screen.layout';
import { SettingsRow } from '@/ui/components/molecules/settings-row.molecule';

export default function SettingsScreen() {
  const { navigationAdapter } = useAdapters();
  const {
    goToAppSettings,
    goToLogOut,
    goToChildProfile,
    goToCarerManagement,
    goToAbout,
  } = useNavigation({ navigationAdapter });

  return (
    <ScreenLayout
      testID="screen.settings"
      title="page.settings.title"
      subtitle="page.settings.subtitle"
    >
      <ScrollView
        className="flex-1"
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-12">
          {/* Child Profile Section */}
          <CardAtom>
            <TypographyParagraph
              testID="screen.settings.section_carers"
              i18nKey="page.settings.section_carers"
              className="font-semibold text-default-400 uppercase"
              accessibilityRole="header"
            />
            <SettingsRow
              iconName="person"
              titleKey="page.settings.child_profile"
              captionKey="page.settings.child_profile_desc"
              onPress={goToChildProfile}
              testID="screen.settings.child_profile"
            />

            <SettingsRow
              iconName="people"
              titleKey="page.settings.manage_carers"
              captionKey="page.settings.manage_carers_desc"
              onPress={goToCarerManagement}
              testID="screen.settings.manage_carers"
            />
          </CardAtom>

          {/* App Settings Section */}
          <CardAtom>
            <TypographyParagraph
              testID="screen.settings.section_app"
              i18nKey="page.settings.section_app"
              className="font-semibold text-default-400 uppercase"
              accessibilityRole="header"
            />

            <SettingsRow
              iconName="settings"
              titleKey="page.settings.app_settings"
              captionKey="page.settings.app_settings_desc"
              onPress={goToAppSettings}
              testID="screen.settings.app_settings"
              hasDivider
            />

            <SettingsRow
              iconName="information-circle"
              titleKey="page.settings.about"
              captionKey="page.settings.about_desc"
              onPress={goToAbout}
              testID="screen.settings.about"
            />
          </CardAtom>

          {/* Danger Zone */}
          <CardAtom className="bg-danger/80">
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="a11y.button.logout"
              accessibilityHint="a11y.hint.logout_action"
              onPress={goToLogOut}
            >
              <CardAtom className="flex-row items-center justify-center p-0 bg-transparent h-10">
                <TypographyParagraph
                  testID="screen.settings.logout"
                  i18nKey="page.settings.logout"
                  className="font-semibold text-white"
                />
              </CardAtom>
            </Pressable>
          </CardAtom>
        </View>
      </ScrollView>
    </ScreenLayout>
  );
}
