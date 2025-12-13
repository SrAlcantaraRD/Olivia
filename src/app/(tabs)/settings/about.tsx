import { View } from 'react-native';

import {
  TypographyParagraph,
  TypographyTitle,
} from '@/ui/components/atoms/typography.atom';

export default function AboutScreen() {
  return (
    <View className="flex-1 bg-background p-4">
      <TypographyTitle
        testID="screen.settings.about.title"
        i18nKey="page.about.title"
        accessibilityRole="header"
      />
      <TypographyParagraph
        testID="screen.settings.about.placeholder"
        i18nKey="page.about.placeholder"
        variant="light"
      />
    </View>
  );
}
