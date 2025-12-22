import type React from 'react';
import { Pressable, View } from 'react-native';

import {
  TypographyHeading,
  TypographyParagraph,
} from '@/ui/components/atoms/typography.atom';
import type { Ti18nKeys } from '@/ui/i18n/locales/en-EN';

interface SummarySectionHeaderProps {
  titleKey: Ti18nKeys;
  actionKey?: Ti18nKeys;
  onActionPress?: () => void;
  testID: string;
}

export const SummarySectionHeader: React.FC<SummarySectionHeaderProps> = ({
  titleKey,
  actionKey,
  onActionPress,
  testID,
}) => {
  return (
    <View className="flex-row items-center justify-between">
      <TypographyHeading
        testID={`${testID}.title`}
        i18nKey={titleKey}
        accessibilityRole="header"
      />
      {actionKey && (
        <Pressable onPress={onActionPress} accessibilityRole="button">
          <TypographyParagraph
            testID={`${testID}.action`}
            i18nKey={actionKey}
            className="font-medium"
            variant="primary"
          />
        </Pressable>
      )}
    </View>
  );
};
