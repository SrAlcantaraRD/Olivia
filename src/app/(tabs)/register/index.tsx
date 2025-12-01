import { Link } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, Text, View } from 'react-native';

export default function RegisterScreen() {
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
              {t('page.register.title')}
            </Text>
            <Text className="text-base text-default-500">
              {t('page.register.subtitle')}
            </Text>
          </View>

          {/* Quick Actions */}
          <View className="gap-4">
            <Text
              className="text-lg font-medium text-foreground"
              accessibilityRole="header"
            >
              {t('page.register.quick_actions')}
            </Text>

            {/* CIC Button */}
            <Link href="/(modals)/modal-register-cic" asChild>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={t('a11y.button.register_cic')}
                accessibilityHint={t('a11y.hint.opens_cic_form')}
              >
                <View className="flex-row items-center gap-3 p-4 bg-primary rounded-xl">
                  <Text className="text-2xl">💧</Text>
                  <Text className="text-lg font-semibold text-primary-foreground flex-1">
                    {t('component.register_cic_button.label')}
                  </Text>
                </View>
              </Pressable>
            </Link>

            {/* Stool Button */}
            <Link href="/(modals)/modal-filter-history" asChild>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={t('a11y.button.register_stool')}
                accessibilityHint={t('a11y.hint.opens_stool_form')}
              >
                <View className="flex-row items-center gap-3 p-4 bg-secondary rounded-xl">
                  <Text className="text-2xl">💩</Text>
                  <Text className="text-lg font-semibold text-secondary-foreground flex-1">
                    {t('component.register_stool_button.label')}
                  </Text>
                </View>
              </Pressable>
            </Link>

            {/* Medication Button */}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('a11y.button.register_medication')}
              accessibilityHint={t('a11y.hint.opens_medication_form')}
            >
              <View className="flex-row items-center gap-3 p-4 bg-success rounded-xl">
                <Text className="text-2xl">💊</Text>
                <Text className="text-lg font-semibold text-success-foreground flex-1">
                  {t('component.register_medication_button.label')}
                </Text>
              </View>
            </Pressable>
          </View>

          {/* Recent Activity Placeholder */}
          <View className="gap-4 mt-4">
            <Text
              className="text-lg font-medium text-foreground"
              accessibilityRole="header"
            >
              {t('page.register.recent_activity')}
            </Text>
            <View className="p-4 bg-default-100 rounded-lg">
              <Text className="text-sm text-default-500 text-center">
                {t('page.register.no_recent_activity')}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
