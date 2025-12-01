import { Pressable, ScrollView, View } from 'react-native';

import { CardAtom } from '@/ui/components/atoms/card.atom';
import {
  Typography,
  TypographySmall,
  TypographyTitle,
} from '@/ui/components/atoms/typography.atom';

export default function SettingsScreen() {
  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16 }}
        contentInsetAdjustmentBehavior="automatic"
      >
        <View className="gap-6">
          {/* Header */}
          <View className="gap-2">
            <TypographyTitle
              i18nKey="page.settings.title"
              accessibilityRole="header"
            />
            <TypographySmall i18nKey="page.settings.subtitle" variant="light" />
          </View>

          {/* Child Profile Section */}
          <View className="gap-3">
            <TypographySmall
              i18nKey="page.settings.section_child"
              className="font-semibold text-default-400 uppercase"
              accessibilityRole="header"
            />

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="a11y.button.child_profile"
              accessibilityHint="a11y.hint.opens_child_profile"
            >
              <CardAtom className="flex-row items-center justify-between p-4 bg-default-100">
                <View className="flex-row items-center gap-3">
                  <Typography className="text-xl">👶</Typography>
                  <View>
                    <Typography
                      i18nKey="page.settings.child_profile"
                      className="text-base font-medium text-foreground"
                    />
                    <TypographySmall
                      i18nKey="page.settings.child_profile_desc"
                      variant="light"
                    />
                  </View>
                </View>
                <Typography className="text-default-400">›</Typography>
              </CardAtom>
            </Pressable>
          </View>

          {/* Carers Section */}
          <View className="gap-3">
            <TypographySmall
              i18nKey="page.settings.section_carers"
              className="font-semibold text-default-400 uppercase"
              accessibilityRole="header"
            />

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="a11y.button.manage_carers"
              accessibilityHint="a11y.hint.opens_carer_management"
            >
              <CardAtom className="flex-row items-center justify-between p-4 bg-default-100">
                <View className="flex-row items-center gap-3">
                  <Typography className="text-xl">👥</Typography>
                  <View>
                    <Typography
                      i18nKey="page.settings.manage_carers"
                      className="text-base font-medium text-foreground"
                    />
                    <TypographySmall
                      i18nKey="page.settings.manage_carers_desc"
                      variant="light"
                    />
                  </View>
                </View>
                <Typography className="text-default-400">›</Typography>
              </CardAtom>
            </Pressable>
          </View>

          {/* App Settings Section */}
          <View className="gap-3">
            <TypographySmall
              i18nKey="page.settings.section_app"
              className="font-semibold text-default-400 uppercase"
              accessibilityRole="header"
            />

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="a11y.button.app_settings"
              accessibilityHint="a11y.hint.opens_app_settings"
            >
              <CardAtom className="flex-row items-center justify-between p-4 bg-default-100">
                <View className="flex-row items-center gap-3">
                  <Typography className="text-xl">⚙️</Typography>
                  <View>
                    <Typography
                      i18nKey="page.settings.app_settings"
                      className="text-base font-medium text-foreground"
                    />
                    <TypographySmall
                      i18nKey="page.settings.app_settings_desc"
                      variant="light"
                    />
                  </View>
                </View>
                <Typography className="text-default-400">›</Typography>
              </CardAtom>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="a11y.button.about"
              accessibilityHint="a11y.hint.opens_about"
            >
              <CardAtom className="flex-row items-center justify-between p-4 bg-default-100">
                <View className="flex-row items-center gap-3">
                  <Typography className="text-xl">ℹ️</Typography>
                  <View>
                    <Typography
                      i18nKey="page.settings.about"
                      className="text-base font-medium text-foreground"
                    />
                    <TypographySmall
                      i18nKey="page.settings.about_desc"
                      variant="light"
                    />
                  </View>
                </View>
                <Typography className="text-default-400">›</Typography>
              </CardAtom>
            </Pressable>
          </View>

          {/* Danger Zone */}
          <View className="gap-3 mt-4">
            <TypographySmall
              i18nKey="page.settings.section_danger"
              className="font-semibold text-danger uppercase"
              accessibilityRole="header"
            />

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="a11y.button.logout"
              accessibilityHint="a11y.hint.logout_action"
            >
              <CardAtom className="flex-row items-center justify-center p-4 bg-danger/10 border border-danger/20">
                <Typography
                  i18nKey="page.settings.logout"
                  className="text-base font-semibold text-danger"
                />
              </CardAtom>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
