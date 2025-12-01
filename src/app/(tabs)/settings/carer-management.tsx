import { useTranslation } from 'react-i18next';
import { ScrollView, Text, View } from 'react-native';

export default function CarerManagementScreen() {
  const { t } = useTranslation();

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16 }}
        contentInsetAdjustmentBehavior="automatic"
      >
        <View className="gap-6">
          <Text
            className="text-3xl font-semibold text-foreground"
            accessibilityRole="header"
          >
            {t('page.carer_management.title')}
          </Text>

          <View className="p-4 bg-default-100 rounded-lg">
            <Text className="text-sm text-default-500 text-center">
              {t('page.carer_management.placeholder')}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
