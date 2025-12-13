import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, View } from 'react-native';

import { useAdapters } from '@/adapter';
import { useNavigation } from '@/hooks/use-navigation.hook';
import { CardAtom } from '@/ui/components/atoms/card.atom';
import { TextTranslation } from '@/ui/components/atoms/text-translations.atom';
import { TypographyParagraph } from '@/ui/components/atoms/typography.atom';
import { ScreenLayout } from '@/ui/components/layouts/screen.layout';
import { SettingsRow } from '@/ui/components/molecules/settings-row.molecule';

export default function SettingsScreen() {
  const { t } = useTranslation();

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
        {/* TODO: Añadir avatar del carer logueada y nombre */}
        <View className="gap-4">
          {/* Child Profile Section */}
          <CardAtom>
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
          </CardAtom>

          {/* App Settings Section */}
          <CardAtom>
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
              iconName="information-circle"
              titleKey="page.settings.about"
              captionKey="page.settings.about-desc"
              onPress={goToAbout}
              testID="screen.settings.about"
            />
          </CardAtom>

          {/* Danger Zone */}
          <CardAtom className="bg-danger/80">
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('a11y.button.logout')}
              accessibilityHint="a11y.hint.logout-action"
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
