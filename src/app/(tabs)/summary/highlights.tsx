import React from 'react';
import { ScrollView, View } from 'react-native';

import { useAdapters } from '@/adapter';
import { useGetListActiveModule } from '@/domain/module/hook/get-list-active-module.hook';
import { SUMMARY_PERIOD_ENUM } from '@/domain/summary/enum/summary-period.enum';
import { useGetSummaryModuleListByPeriod } from '@/domain/summary/hook/use-get-summary-module-list-by-period.hook';
import { RowEmptyAtom } from '@/ui/components/atoms/row-empty.atom';
import { ScreenLayout } from '@/ui/components/layouts/screen.layout';
import { RowAction } from '@/ui/components/molecules/row-action.molecule';
import { SummaryInsightCard } from '@/ui/components/molecules/summary-insight-card.molecule';
import { SummarySectionHeader } from '@/ui/components/molecules/summary-section-header.molecule';
import { useNavigation } from '@/ui/hook/use-navigation.hook';

export default function SummaryHighlightsScreen() {
  const {
    moduleAdapter,
    summaryGroupingPort,
    notifyAdapter,
    navigationAdapter,
    loggerAdapter,
  } = useAdapters();

  const { goToSummaryAllData, goToSummaryModuleDetail } = useNavigation({
    navigationAdapter,
  });

  const activeModuleHook = useGetListActiveModule({
    loggerAdapter,
    moduleAdapter,
    notifyAdapter,
  });

  // Highlights uses "Today" context usually, but charts need history.
  // We fetch WEEK to show trend line in the highlight card.
  const [period] = React.useState(SUMMARY_PERIOD_ENUM.WEEK);

  const activeModuleIds = React.useMemo(
    () => activeModuleHook.items?.map((m) => m.id) ?? [],
    [activeModuleHook.items]
  );

  const { data: modulesSummary } = useGetSummaryModuleListByPeriod({
    moduleIdList: activeModuleIds,
    period,
    loggerAdapter,
    summaryGroupingPort,
    notifyAdapter,
  });

  React.useEffect(() => {
    void activeModuleHook.execute();
  }, []);

  // Filter modules with significant activity or changes
  const highlights = React.useMemo(() => {
    // For now, just show top 5 active modules
    return [...modulesSummary]
      .sort(
        (a, b) =>
          b.statistics.currentPeriodTotal - a.statistics.currentPeriodTotal
      )
      .slice(0, 5);
  }, [modulesSummary]);

  return (
    <ScreenLayout
      testID="page.summary-highlights"
      title="page.summary_highlights.title"
      subtitle="page.summary_highlights.subtitle"
    >
      <ScrollView
        className="flex-1"
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-4">
          <RowAction
            iconName="heart"
            title="page.summary.all-data"
            onPress={goToSummaryAllData}
            testID="page.summary-highlights.all-data"
          />

          <SummarySectionHeader
            titleKey="page.summary_highlights.heading"
            testID="page.summary-highlights.heading"
          />

          {highlights.length === 0 ? (
            <SummaryInsightCard
              titleKey="page.summary_highlights.empty"
              descriptionKey="page.summary_highlights.empty"
              iconName="alert"
              chartValues={[]}
              chartAverage={0}
              metricValue={0}
              metricLabel=""
              testID="page.summary-highlights.empty"
            />
          ) : (
            highlights.map((highlight) => (
              <SummaryInsightCard
                key={`summary-highlight-${highlight.module.id}`}
                // Using a generic key for title to avoid types error,
                // ideally we would translate the module code.
                // Since SummaryInsightCard enforces Ti18nKeys, we use a generic one
                // and put details in description or metric label.
                titleKey="page.summary-detail.highlights"
                descriptionKey="page.summary-detail.trend"
                // We can't easily pass dynamic string as titleKey.
                // This is a limitation of SummaryInsightCard props.
                // For now using generic keys.
                iconName="flame"
                metricValue={highlight.statistics.currentPeriodTotal}
                metricLabel={`${highlight.module.code}`} // Using metric label to show Module Name
                chartValues={highlight.groupedData.buckets.map((b) => b.value)}
                chartAverage={highlight.statistics.previousPeriodTotal / 7}
                onPress={() =>
                  goToSummaryModuleDetail(String(highlight.module.id))
                }
                testID={`page.summary-highlights.item.${highlight.module.id}`}
              />
            ))
          )}

          <RowAction
            iconName="sparkles"
            title="page.summary.highlights"
            onPress={goToSummaryAllData}
            testID="page.summary-highlights.show-all"
          />
        </View>
        <RowEmptyAtom />
      </ScrollView>
    </ScreenLayout>
  );
}
