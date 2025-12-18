import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ScrollView, View } from 'react-native';

import { useAdapters } from '@/adapter';
import { BASE_LOGGER } from '@/domain/core/adapter/logger.adapter';
import { SUMMARY_DETAIL_TYPE_ENUM } from '@/domain/summary/enum/summary-detail-type.enum';
import { SUMMARY_PERIOD_ENUM } from '@/domain/summary/enum/summary-period.enum';
import { SUMMARY_PIN_TYPE_ENUM } from '@/domain/summary/enum/summary-pin-type.enum';
import { useGetSummaryPins } from '@/domain/summary/hook/get-summary-pins.hook';
import { usePinSummaryItem } from '@/domain/summary/hook/pin-summary-item.hook';
import { useUnpinSummaryItem } from '@/domain/summary/hook/unpin-summary-item.hook';
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
import { SummaryRow } from '@/ui/components/molecules/summary-row.molecule';
import { SummarySectionHeader } from '@/ui/components/molecules/summary-section-header.molecule';
import { useNavigation } from '@/hooks/use-navigation.hook';

export default function SummaryFieldDetailScreen() {
  const params = useLocalSearchParams<{
    moduleId?: string;
    fieldId?: string;
  }>();
  const moduleId = Number(params.moduleId ?? 0);
  const fieldId = Number(params.fieldId ?? 0);

  const {
    summaryDetailAdapter,
    notifyAdapter,
    summaryPinsAdapter,
    navigationAdapter,
  } = useAdapters();

  const { goToSummaryModuleDetail } = useNavigation({ navigationAdapter });

  const detailHook = useGetSummaryDetail({
    loggerAdapter: BASE_LOGGER,
    summaryDetailAdapter,
    notifyAdapter,
  });

  const pinsListHook = useGetSummaryPins({
    loggerAdapter: BASE_LOGGER,
    summaryPinsAdapter,
    notifyAdapter,
  });

  const pinHook = usePinSummaryItem({
    loggerAdapter: BASE_LOGGER,
    summaryPinsAdapter,
    notifyAdapter,
  });

  const unpinHook = useUnpinSummaryItem({
    loggerAdapter: BASE_LOGGER,
    summaryPinsAdapter,
    notifyAdapter,
  });

  React.useEffect(() => {
    if (!moduleId || !fieldId) return;
    void detailHook.execute({
      type: SUMMARY_DETAIL_TYPE_ENUM.FIELD,
      moduleId,
      fieldId,
      period: SUMMARY_PERIOD_ENUM.WEEK,
    });
    void pinsListHook.execute();
  }, [moduleId, fieldId]);

  const chartValues = detailHook.items.series.map((item) => ({
    value: '',
    count: item.value,
  }));
  const hasSeries = detailHook.items.series.length > 0;

  const targetId = `${moduleId}:${fieldId}`;
  const isPinned = pinsListHook.items.some(
    (pin) =>
      pin.type === SUMMARY_PIN_TYPE_ENUM.FIELD && pin.targetId === targetId
  );

  const handlePinToggle = async () => {
    if (isPinned) {
      await unpinHook.execute({
        type: SUMMARY_PIN_TYPE_ENUM.FIELD,
        targetId,
      });
      return;
    }

    await pinHook.execute({
      type: SUMMARY_PIN_TYPE_ENUM.FIELD,
      targetId,
    });
  };

  return (
    <ScreenLayout
      testID="page.summary-detail-field"
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

          <CardAtom className="p-0 rounded-2xl">
            <View className="p-4">
              <SummarySectionHeader
                titleKey="page.summary-detail.actions"
                testID="page.summary-detail.actions"
              />
            </View>
            <View className="px-4 pb-4 gap-2">
              <SummaryRow
                iconName={isPinned ? 'bookmark' : 'bookmark-outline'}
                titleKey={
                  isPinned
                    ? 'page.summary-detail.unpin'
                    : 'page.summary-detail.pin'
                }
                onPress={handlePinToggle}
                testID="page.summary-detail.pin-toggle"
              />
              <SummaryRow
                iconName="list"
                titleKey="page.summary-detail.back-to-module"
                onPress={() => goToSummaryModuleDetail(String(moduleId))}
                testID="page.summary-detail.back-to-module"
              />
            </View>
          </CardAtom>
        </View>
      </ScrollView>
    </ScreenLayout>
  );
}
