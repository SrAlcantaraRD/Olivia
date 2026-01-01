import { ScrollView, View } from 'react-native';

import {
  TypographyParagraph,
  TypographyTitle,
} from '@/ui/components/atoms/typography.atom';

export default function ChildProfileScreen() {
  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16 }}
        contentInsetAdjustmentBehavior="automatic"
      >
        <View className="gap-4">
          <TypographyTitle
            testID="screen.settings.child-profile.title"
            i18nKey="page.child-profile.title"
            accessibilityRole="header"
          />

          <View className="p-4 bg-default-100 rounded-lg">
            <TypographyParagraph
              testID="screen.settings.child-profile.placeholder"
              i18nKey="page.child-profile.placeholder"
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
