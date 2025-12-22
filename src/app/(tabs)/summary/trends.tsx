import React from 'react';
import { ScrollView, View } from 'react-native';

import { useAdapters } from '@/adapter';
import { BASE_LOGGER } from '@/domain/core/adapter/logger.adapter';
import type { Ti18nKeys } from '@/domain/core/types/i18n.types';
import { useGetSummaryTrends } from '@/domain/summary/hook/get-summary-trends.hook';
import { ScreenLayout } from '@/ui/components/layouts/screen.layout';
import { SummaryInsightCard } from '@/ui/components/molecules/summary-insight-card.molecule';
import { SummarySectionHeader } from '@/ui/components/molecules/summary-section-header.molecule';
import { useNavigation } from '@/ui/hook/use-navigation.hook';

const DEFAULT_TREND_SERIES = [2, 4, 3, 5, 3, 2, 4, 3, 5, 4, 3, 2];

export default function SummaryTrendsScreen() {
  const { summaryTrendAdapter, notifyAdapter, navigationAdapter } =
    useAdapters();
  const { goToSummaryTrendDetail } = useNavigation({ navigationAdapter });

  const trendsHook = useGetSummaryTrends({
    loggerAdapter: BASE_LOGGER,
    summaryTrendAdapter,
    notifyAdapter,
  });

  React.useEffect(() => {
    void trendsHook.execute();
  }, []);

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
        <View className="gap-6">
          <SummarySectionHeader
            titleKey="page.summary-trends.heading"
            testID="page.summary-trends.heading"
          />

          {trendsHook.items.length === 0 ? (
            <SummaryInsightCard
              titleKey="page.summary-trends.empty"
              descriptionKey="page.summary-trends.empty"
              iconName="alert"
              chartValues={DEFAULT_TREND_SERIES}
              chartAverage={3}
              testID="page.summary-trends.empty"
            />
          ) : (
            trendsHook.items.map((trend) => (
              <SummaryInsightCard
                key={`summary-trend-${trend.id}`}
                titleKey={trend.titleKey as Ti18nKeys}
                descriptionKey={trend.descriptionKey as Ti18nKeys}
                iconName="flame"
                chartValues={DEFAULT_TREND_SERIES}
                chartAverage={3}
                onPress={() => goToSummaryTrendDetail(trend.id)}
                testID={`page.summary-trends.item.${trend.id}`}
              />
            ))
          )}
        </View>
      </ScrollView>
    </ScreenLayout>
  );
}
