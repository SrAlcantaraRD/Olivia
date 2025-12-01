import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, Text, View } from 'react-native';

export default function SettingsScreen() {
  const { t } = useTranslation();

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
            <Text
              className="text-3xl font-semibold text-foreground"
              accessibilityRole="header"
            >
              {t('page.settings.title')}
            </Text>
            <Text className="text-base text-default-500">
              {t('page.settings.subtitle')}
            </Text>
          </View>

          {/* Child Profile Section */}
          <View className="gap-3">
            <Text
              className="text-sm font-semibold text-default-400 uppercase"
              accessibilityRole="header"
            >
              {t('page.settings.section_child')}
            </Text>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('a11y.button.child_profile')}
              accessibilityHint={t('a11y.hint.opens_child_profile')}
            >
              <View className="flex-row items-center justify-between p-4 bg-default-100 rounded-xl">
                <View className="flex-row items-center gap-3">
                  <Text className="text-xl">👶</Text>
                  <View>
                    <Text className="text-base font-medium text-foreground">
                      {t('page.settings.child_profile')}
                    </Text>
                    <Text className="text-sm text-default-500">
                      {t('page.settings.child_profile_desc')}
                    </Text>
                  </View>
                </View>
                <Text className="text-default-400">›</Text>
              </View>
            </Pressable>
          </View>

          {/* Carers Section */}
          <View className="gap-3">
            <Text
              className="text-sm font-semibold text-default-400 uppercase"
              accessibilityRole="header"
            >
              {t('page.settings.section_carers')}
            </Text>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('a11y.button.manage_carers')}
              accessibilityHint={t('a11y.hint.opens_carer_management')}
            >
              <View className="flex-row items-center justify-between p-4 bg-default-100 rounded-xl">
                <View className="flex-row items-center gap-3">
                  <Text className="text-xl">👥</Text>
                  <View>
                    <Text className="text-base font-medium text-foreground">
                      {t('page.settings.manage_carers')}
                    </Text>
                    <Text className="text-sm text-default-500">
                      {t('page.settings.manage_carers_desc')}
                    </Text>
                  </View>
                </View>
                <Text className="text-default-400">›</Text>
              </View>
            </Pressable>
          </View>

          {/* App Settings Section */}
          <View className="gap-3">
            <Text
              className="text-sm font-semibold text-default-400 uppercase"
              accessibilityRole="header"
            >
              {t('page.settings.section_app')}
            </Text>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('a11y.button.app_settings')}
              accessibilityHint={t('a11y.hint.opens_app_settings')}
            >
              <View className="flex-row items-center justify-between p-4 bg-default-100 rounded-xl">
                <View className="flex-row items-center gap-3">
                  <Text className="text-xl">⚙️</Text>
                  <View>
                    <Text className="text-base font-medium text-foreground">
                      {t('page.settings.app_settings')}
                    </Text>
                    <Text className="text-sm text-default-500">
                      {t('page.settings.app_settings_desc')}
                    </Text>
                  </View>
                </View>
                <Text className="text-default-400">›</Text>
              </View>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('a11y.button.about')}
              accessibilityHint={t('a11y.hint.opens_about')}
            >
              <View className="flex-row items-center justify-between p-4 bg-default-100 rounded-xl">
                <View className="flex-row items-center gap-3">
                  <Text className="text-xl">ℹ️</Text>
                  <View>
                    <Text className="text-base font-medium text-foreground">
                      {t('page.settings.about')}
                    </Text>
                    <Text className="text-sm text-default-500">
                      {t('page.settings.about_desc')}
                    </Text>
                  </View>
                </View>
                <Text className="text-default-400">›</Text>
              </View>
            </Pressable>
          </View>

          {/* Danger Zone */}
          <View className="gap-3 mt-4">
            <Text
              className="text-sm font-semibold text-danger uppercase"
              accessibilityRole="header"
            >
              {t('page.settings.section_danger')}
            </Text>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('a11y.button.logout')}
              accessibilityHint={t('a11y.hint.logout_action')}
            >
              <View className="flex-row items-center justify-center p-4 bg-danger/10 rounded-xl border border-danger/20">
                <Text className="text-base font-semibold text-danger">
                  {t('page.settings.logout')}
                </Text>
              </View>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
