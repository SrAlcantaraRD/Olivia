import { Link } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, Text, View } from 'react-native';

export default function ReportScreen() {
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
              {t('page.report.title')}
            </Text>
            <Text className="text-base text-default-500">
              {t('page.report.subtitle')}
            </Text>
          </View>

          {/* Filter Section */}
          <View className="gap-4">
            <Text
              className="text-lg font-medium text-foreground"
              accessibilityRole="header"
            >
              {t('page.report.filters')}
            </Text>

            <Link href="/(modals)/modal-filter-history" asChild>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={t('a11y.button.open_filters')}
                accessibilityHint={t('a11y.hint.opens_filter_modal')}
              >
                <View className="flex-row items-center gap-3 p-4 bg-default-100 rounded-xl">
                  <Text className="text-xl">🔍</Text>
                  <Text className="text-base font-medium text-foreground flex-1">
                    {t('component.filter_button.label')}
                  </Text>
                  <Text className="text-sm text-default-400">
                    {t('component.filter_button.all_types')}
                  </Text>
                </View>
              </Pressable>
            </Link>
          </View>

          {/* Statistics Cards */}
          <View className="gap-4">
            <Text
              className="text-lg font-medium text-foreground"
              accessibilityRole="header"
            >
              {t('page.report.statistics')}
            </Text>

            {/* Stat Card 1 - CIC */}
            <View className="p-4 bg-primary/10 rounded-xl border border-primary/20">
              <View className="flex-row items-center gap-2 mb-2">
                <Text className="text-xl">💧</Text>
                <Text className="text-sm font-medium text-primary">
                  {t('component.stat_card.cic_label')}
                </Text>
              </View>
              <Text className="text-3xl font-bold text-foreground">0</Text>
              <Text className="text-sm text-default-500 mt-1">
                {t('component.stat_card.today')}
              </Text>
            </View>

            {/* Stat Card 2 - Stool */}
            <View className="p-4 bg-secondary/10 rounded-xl border border-secondary/20">
              <View className="flex-row items-center gap-2 mb-2">
                <Text className="text-xl">💩</Text>
                <Text className="text-sm font-medium text-secondary">
                  {t('component.stat_card.stool_label')}
                </Text>
              </View>
              <Text className="text-3xl font-bold text-foreground">0</Text>
              <Text className="text-sm text-default-500 mt-1">
                {t('component.stat_card.today')}
              </Text>
            </View>

            {/* Stat Card 3 - Medication */}
            <View className="p-4 bg-success/10 rounded-xl border border-success/20">
              <View className="flex-row items-center gap-2 mb-2">
                <Text className="text-xl">💊</Text>
                <Text className="text-sm font-medium text-success">
                  {t('component.stat_card.medication_label')}
                </Text>
              </View>
              <Text className="text-3xl font-bold text-foreground">0</Text>
              <Text className="text-sm text-default-500 mt-1">
                {t('component.stat_card.today')}
              </Text>
            </View>
          </View>

          {/* History Section */}
          <View className="gap-4 mt-4">
            <Text
              className="text-lg font-medium text-foreground"
              accessibilityRole="header"
            >
              {t('page.report.history')}
            </Text>

            <View className="p-4 bg-default-100 rounded-lg">
              <Text className="text-sm text-default-500 text-center">
                {t('page.report.no_history')}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
