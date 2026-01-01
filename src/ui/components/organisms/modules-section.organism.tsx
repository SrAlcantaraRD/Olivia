import { type FC, useEffect } from 'react';
import { View } from 'react-native';

import { useAdapters } from '@/adapter';
import { SUMMARY_PERIOD_ENUM } from '@/domain/summary/enum/summary-period.enum';
import { useGetSummaryModuleListByPeriod } from '@/domain/summary/hook/use-get-summary-module-list-by-period.hook';
import { RowAction } from '@/ui/components/molecules/row-action.molecule';
import { SummaryModuleCard } from '@/ui/components/molecules/summary-card.module.molecule';
import { SummarySectionHeader } from '@/ui/components/molecules/summary-section-header.molecule';

interface ModulesSectionProps {
  testID: string;
}

export const ModulesSection: FC<ModulesSectionProps> = ({ testID }) => {
  const { notifyAdapter, loggerAdapter, cacheAdapter, summaryModuleAdapter } =
    useAdapters();

  const { items: summaryModuleList, execute: loadSummaryModuleList } =
    useGetSummaryModuleListByPeriod({
      loggerAdapter,
      notifyAdapter,
      cacheAdapter,
      summaryModuleAdapter,
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
          onPress={() => {}}
          testID={`${testID}.empty`}
        />
      ) : (
        summaryModuleList.map((summary) => (
          <SummaryModuleCard
            key={`summary-module-${summary.metadata.module.id}`}
            testID={`${testID}.${summary.metadata.module.id}`}
            summary={summary}
          />
        ))
      )}
    </View>
  );
};
