import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';

import { useAdapters } from '@/adapter';
import { useGetListActiveModule } from '@/domain/module/hook/get-list-active-module.hook';
import { SUMMARY_PERIOD_ENUM } from '@/domain/summary/enum/summary-period.enum';
import { useGetSummaryModuleListByPeriod } from '@/domain/summary/hook/use-get-summary-module-list-by-period.hook';
import { CardAtom } from '@/ui/components/atoms/card.atom';
import { RowEmptyAtom } from '@/ui/components/atoms/row-empty.atom';
import { TypographyParagraph } from '@/ui/components/atoms/typography.atom';
import { ScreenLayout } from '@/ui/components/layouts/screen.layout';
import { SummaryModuleCard } from '@/ui/components/molecules/summary-card.module-field.molecule';
import { SummarySectionHeader } from '@/ui/components/molecules/summary-section-header.molecule';
import { useNavigation } from '@/ui/hook/use-navigation.hook';

export default function SummaryTrendsScreen() {
  const { t } = useTranslation();
  const {
    moduleAdapter,
    notifyAdapter,
    loggerAdapter,
    navigationAdapter,
    summaryModuleAdapter,
    cacheAdapter,
  } = useAdapters();

  const { goToSummaryModuleDetail } = useNavigation({ navigationAdapter });

  const activeModuleHook = useGetListActiveModule({
    loggerAdapter,
    moduleAdapter,
    notifyAdapter,
  });

  // Week period is good for trends (Last 7 days)
  const [period] = React.useState(SUMMARY_PERIOD_ENUM.WEEK);

  const activeModuleIds = React.useMemo(
    () => activeModuleHook.items?.map((m) => m.id) ?? [],
    [activeModuleHook.items]
  );

  const { data: modulesSummary } = useGetSummaryModuleListByPeriod({
    loggerAdapter,
    notifyAdapter,
    cacheAdapter,
    summaryModuleAdapter,
  });

  React.useEffect(() => {
    void activeModuleHook.execute();
  }, []);

  // Sort by percentage change magnitude (descending)
  const sortedSummaries = React.useMemo(() => {
    return [...modulesSummary].sort((a, b) => {
      const changeA = Math.abs(a.statistics.percentageChange ?? 0);
      const changeB = Math.abs(b.statistics.percentageChange ?? 0);
      return changeB - changeA;
    });
  }, [modulesSummary]);

  return (
    <ScreenLayout
      testID="page.summary-trends"
      title="page.summary-trends.title"
      subtitle="page.summary-trends.subtitle"
    >
      <ScrollView
        className="flex-1"
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-4">
          <SummarySectionHeader
            titleKey="page.summary-trends.heading"
            testID="page.summary-trends.heading"
          />

          {sortedSummaries.length === 0 ? (
            <CardAtom className="p-4">
              <TypographyParagraph i18nKey="page.summary-trends.empty" />
            </CardAtom>
          ) : (
            sortedSummaries.map((summary) => (
              <SummaryModuleCard
                key={`summary-trend-${summary.module.id}`}
                summary={summary}
                metricValue={summary.statistics.currentPeriodTotal}
                metricLabel="page.summary.metric-label.total"
                chartAverage={
                  summary.statistics.previousPeriodTotal > 0
                    ? summary.statistics.previousPeriodTotal /
                      summary.groupedData.buckets.length
                    : null
                }
                onPress={() =>
                  goToSummaryModuleDetail(String(summary.module.id))
                }
                testID={`page.summary-trends.item.${summary.module.id}`}
              />
            ))
          )}
        </View>
        <RowEmptyAtom />
      </ScrollView>
    </ScreenLayout>
  );
}
