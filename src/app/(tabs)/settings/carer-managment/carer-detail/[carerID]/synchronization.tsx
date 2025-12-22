import { View } from 'react-native';

import {
  TypographyParagraph,
  TypographyTitle,
} from '@/ui/components/atoms/typography.atom';

export default function SynchronizationScreen() {
  return (
    <View className="flex-1 bg-background p-4">
      <TypographyTitle
        testID="screen.settings.synchronization.title"
        i18nKey="page.carer-detail.sync-history.title"
        accessibilityRole="header"
      />
      <TypographyParagraph
        testID="screen.settings.synchronization.placeholder"
        i18nKey="page.carer-detail.sync-history.empty"
        variant="light"
      />
    </View>
  );
}
