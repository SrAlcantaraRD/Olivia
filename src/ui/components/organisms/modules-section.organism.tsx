import { type FC, useEffect } from 'react';
import { View } from 'react-native';

import { useAdapters } from '@/adapter';
import { SUMMARY_PERIOD_ENUM } from '@/domain/summary/enum/summary-period.enum';
import { useGetSummaryModuleListByPeriod } from '@/domain/summary/hook/use-get-summary-module-list-by-period.hook';
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

  const { items: summaryModuleList, execute: loadSummaryModuleList } =
    useGetSummaryModuleListByPeriod({
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
    loadSummaryModuleList({ period: SUMMARY_PERIOD_ENUM.WEEK });
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
      {summaryModuleList.length === 0 ? (
        <RowAction
          iconName="alert"
          title="page.summary.modules-empty"
          onPress={goToSummaryAllData}
          testID={`${testID}.empty`}
        />
      ) : (
        summaryModuleList.map((summary) => (
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
