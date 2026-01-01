import { useLocalSearchParams } from 'expo-router';
import { ScrollView } from 'react-native';

import { SummaryModuleFieldsSection } from '@/app/(tabs)/summary/detail/module/components/summary-module-fields-section.organism';
import { SummaryModuleTrendSection } from '@/app/(tabs)/summary/detail/module/components/summary-module-trend-section.organism';
import { RowEmptyAtom } from '@/ui/components/atoms/row-empty.atom';
import { ScreenLayout } from '@/ui/components/layouts/screen.layout';
import { SummaryModuleActionsSection } from './components/summary-module-actions-section.organism';

export default function SummaryModuleDetailScreen() {
  const params = useLocalSearchParams<{ moduleId?: string }>();
  const moduleID = Number(params.moduleId ?? 0);

  return (
    <ScreenLayout
      testID="page.summary-detail-module"
      title="page.summary-detail.title"
      subtitle="page.summary-detail.subtitle"
    >
      <ScrollView
        className="flex-1 gap-4"
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
      >
        <SummaryModuleTrendSection
          moduleID={moduleID}
          testID="page.summary-detail.trend"
        />

        <SummaryModuleActionsSection
          moduleID={moduleID}
          testID="page.summary-detail.actions"
        />

        <SummaryModuleFieldsSection
          moduleID={moduleID}
          testID="page.summary-detail.fields"
        />

        <RowEmptyAtom />
      </ScrollView>
    </ScreenLayout>
  );
}
