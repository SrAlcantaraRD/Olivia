import { type FC, useEffect } from 'react';
import { View } from 'react-native';

import { useAdapters } from '@/adapter';
import { useGetSummaryModuleByPeriod } from '@/domain/summary/hook/use-modules-summary.hook';
import { RowAction } from '@/ui/components/molecules/row-action.molecule';
import {
  SummaryCard,
  SummaryCardChartType,
} from '@/ui/components/molecules/summary-card.molecule';
import { SummarySectionHeader } from '@/ui/components/molecules/summary-section-header.molecule';
import { useNavigation } from '@/ui/hook/use-navigation.hook';

interface ModulesSectionProps {
  testID: string;
}

export const ModulesSection: FC<ModulesSectionProps> = ({ testID }) => {
  const {
    moduleAdapter,
    moduleFieldAdapter,
    recordFieldAdapter,
    notifyAdapter,
    navigationAdapter,
    loggerAdapter,
    recordAdapter,
    cacheAdapter,
    summaryAdapter,
  } = useAdapters();

  const { goToSummaryAllData, goToSummaryModuleDetail } = useNavigation({
    navigationAdapter,
  });

  const { items: modulesSummary, execute } = useGetSummaryModuleByPeriod({
    loggerAdapter,
    notifyAdapter,
    cacheAdapter,
    moduleAdapter,
    moduleFieldAdapter,
    recordFieldAdapter,
    recordAdapter,
    summaryAdapter,
  });

  const handlerLoadData = async () => {
    execute({ moduleIds: [] });
  };

  useEffect(() => {
    handlerLoadData();
  }, []);

  return (
    <View className="gap-2">
      <SummarySectionHeader
        titleKey="page.summary.section.modules"
        testID={testID}
      />
      {modulesSummary.length === 0 ? (
        <RowAction
          iconName="alert"
          title="page.summary.modules-empty"
          onPress={goToSummaryAllData}
          testID={`${testID}.empty`}
        />
      ) : (
        modulesSummary.map((summary) => (
          <SummaryCard
            key={`summary-module-${summary.module.id}`}
            summary={summary}
            chartType={SummaryCardChartType.BAR}
            onPress={() => goToSummaryModuleDetail(String(summary.module.id))}
            testID={`${testID}.${summary.module.id}`}
          />
        ))
      )}
    </View>
  );
};
