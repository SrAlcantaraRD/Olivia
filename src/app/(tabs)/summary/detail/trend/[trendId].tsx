import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ScrollView, View } from 'react-native';

import { useAdapters } from '@/adapter';
import { BASE_LOGGER } from '@/domain/core/adapter/logger.adapter';
import { SUMMARY_DETAIL_TYPE_ENUM } from '@/domain/summary/enum/summary-detail-type.enum';
import { SUMMARY_PERIOD_ENUM } from '@/domain/summary/enum/summary-period.enum';
import { useGetSummaryDetail } from '@/domain/summary/hook/get-summary-detail.hook';
import { BarChartAtom } from '@/ui/components/atoms/bar-chart.atom';
import { CardAtom } from '@/ui/components/atoms/card.atom';
import {
  TypographyHeading,
  TypographyParagraph,
  TypographySmall,
} from '@/ui/components/atoms/typography.atom';
import { ScreenLayout } from '@/ui/components/layouts/screen.layout';
import { SummaryInsightCard } from '@/ui/components/molecules/summary-insight-card.molecule';
import { SummaryPeriodSelector } from '@/ui/components/molecules/summary-period-selector.molecule';

export default function SummaryTrendDetailScreen() {
  const params = useLocalSearchParams<{ trendId?: string }>();
  const trendId = params.trendId ?? '';

  const { summaryDetailAdapter, notifyAdapter } = useAdapters();

  const detailHook = useGetSummaryDetail({
    loggerAdapter: BASE_LOGGER,
    summaryDetailAdapter,
    notifyAdapter,
  });

  React.useEffect(() => {
    if (!trendId) return;
    void detailHook.execute({
      type: SUMMARY_DETAIL_TYPE_ENUM.TREND,
      trendId,
      period: SUMMARY_PERIOD_ENUM.WEEK,
    });
  }, [trendId]);

  const chartValues = detailHook.items.series.map((item) => ({
    value: '',
    count: item.value,
  }));
  const hasSeries = detailHook.items.series.length > 0;

  return (
    <ScreenLayout
      testID="page.summary-detail-trend"
      title="page.summary-detail.title"
      subtitle="page.summary-detail.subtitle"
    >
      <ScrollView
        className="flex-1"
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-6">
          <SummaryPeriodSelector
            options={['D', 'S', 'M', '6M', 'A']}
            selected="S"
            testID="page.summary-detail.period"
          />

          <CardAtom className="p-4 rounded-3xl">
            <TypographySmall
              testID="page.summary-detail.average-label"
              i18nKey="page.summary-detail.average-label"
              variant="light"
            />
            <TypographyHeading
              testID="page.summary-detail.average-value"
              i18nKey="common.raw-value"
              values={{ value: detailHook.items.average ?? 0 }}
            />
            <TypographySmall
              testID="page.summary-detail.range"
              i18nKey="page.summary-detail.range-placeholder"
              variant="light"
            />
            {hasSeries ? (
              <View className="mt-4">
                <BarChartAtom
                  values={chartValues}
                  height={180}
                  showAxisLabels={false}
                  testID="page.summary-detail.chart"
                />
              </View>
            ) : (
              <TypographySmall
                testID="page.summary-detail.empty"
                i18nKey="page.summary-detail.empty"
                variant="light"
                className="mt-4"
              />
            )}
          </CardAtom>

          <CardAtom className="p-4 rounded-3xl">
            <View className="flex-row items-center justify-between">
              <TypographyParagraph
                testID="page.summary-detail.trend"
                i18nKey="page.summary-detail.trend"
              />
              <TypographySmall
                testID="page.summary-detail.trend-empty"
                i18nKey="page.summary-detail.trend-empty"
                variant="light"
              />
            </View>
          </CardAtom>

          <SummaryInsightCard
            titleKey="page.summary-detail.highlights"
            descriptionKey={detailHook.items.descriptionKey}
            iconName="flame"
            metricValue={detailHook.items.average ?? 0}
            metricLabel=""
            chartValues={detailHook.items.series.map((item) => item.value)}
            chartAverage={detailHook.items.average}
            testID="page.summary-detail.insight"
          />
        </View>
      </ScrollView>
    </ScreenLayout>
  );
}
