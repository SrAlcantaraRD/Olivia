import { ScrollView, View } from 'react-native';

import {
  TypographyParagraph,
  TypographyTitle,
} from '@/ui/components/atoms/typography.atom';

export default function AppSettingsScreen() {
  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16 }}
        contentInsetAdjustmentBehavior="automatic"
      >
        <View className="gap-6">
          <TypographyTitle
            i18nKey="page.app_settings.title"
            accessibilityRole="header"
          />

          <View className="p-4 bg-default-100 rounded-lg">
            <TypographyParagraph
              i18nKey="page.app_settings.placeholder"
              variant="light"
              size="sm"
              className="text-center"
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
