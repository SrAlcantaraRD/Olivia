import { View } from 'react-native';

import { SummarySectionHeader } from '@/ui/components/molecules/summary-section-header.molecule';

interface SummaryModuleActionsSectionProps {
  moduleID: number;
  testID: string;
}

export const SummaryModuleActionsSection = ({
  moduleID,
  testID,
}: SummaryModuleActionsSectionProps) => {
  return (
    <View className="gap-2" testID={testID}>
      <SummarySectionHeader
        titleKey="page.summary-detail.actions"
        testID={`${testID}.header`}
      />
    </View>
  );
};
