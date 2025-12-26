import type React from 'react';
import { View } from 'react-native';

import { SummarySectionHeader } from '@/ui/components/molecules/summary-section-header.molecule';
import type { Ti18nKeys } from '@/ui/i18n/locales/en-EN';

interface PinnedSectionProps {
  titleKey: Ti18nKeys;
  actionKey?: Ti18nKeys;
  onActionPress?: () => void;
  testID: string;
  children: React.ReactNode;
}

export const PinnedSection: React.FC<PinnedSectionProps> = ({
  titleKey,
  actionKey,
  onActionPress,
  testID,
  children,
}) => {
  return (
    <View className="gap-4">
      <SummarySectionHeader
        titleKey={titleKey}
        actionKey={actionKey}
        onActionPress={onActionPress}
        testID={testID}
      />
      {children}
    </View>
  );
};
