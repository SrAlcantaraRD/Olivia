import { format } from 'date-fns';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ScrollView, View } from 'react-native';

import { useAdapters } from '@/adapter';
import { BASE_LOGGER } from '@/domain/core/adapter/logger.adapter';
import type { Ti18nKeys } from '@/domain/core/types/i18n.types';
import { SUMMARY_DETAIL_TYPE_ENUM } from '@/domain/summary/enum/summary-detail-type.enum';
import {
  SUMMARY_PERIOD_ENUM,
  SUMMARY_PERIOD_I18N_MAP,
  SUMMARY_PERIOD_VALUES,
} from '@/domain/summary/enum/summary-period.enum';
import { SUMMARY_PIN_TYPE_ENUM } from '@/domain/summary/enum/summary-pin-type.enum';
import { useGetSummaryDetail } from '@/domain/summary/hook/get-summary-detail.hook';
import { useGetSummaryPins } from '@/domain/summary/hook/get-summary-pins.hook';
import { usePinSummaryItem } from '@/domain/summary/hook/pin-summary-item.hook';
import { useUnpinSummaryItem } from '@/domain/summary/hook/unpin-summary-item.hook';
import { CardAtom } from '@/ui/components/atoms/card.atom';
import { BarChartAtom } from '@/ui/components/atoms/chart.bar.atom';
import { RowEmptyAtom } from '@/ui/components/atoms/row-empty.atom';
import {
  TypographyHeading,
  TypographyParagraph,
  TypographySmall,
} from '@/ui/components/atoms/typography.atom';
import { ScreenLayout } from '@/ui/components/layouts/screen.layout';
import { RowAction } from '@/ui/components/molecules/row-action.molecule';
import { SummaryInsightCard } from '@/ui/components/molecules/summary-insight-card.molecule';
import { SummaryPeriodSelector } from '@/ui/components/molecules/summary-period-selector.molecule';
import { SummarySectionHeader } from '@/ui/components/molecules/summary-section-header.molecule';
import { useNavigation } from '@/ui/hook/use-navigation.hook';

export default function SummaryTrendDetailScreen() {
  const params = useLocalSearchParams<{ trendId?: string }>();
  const trendId = params.trendId ?? '';

  const {
    summaryDetailAdapter,
    notifyAdapter,
    summaryPinsAdapter,
    navigationAdapter,
  } = useAdapters();

  const { goToSummaryHome } = useNavigation({ navigationAdapter });

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

  const [selectedPeriod, setSelectedPeriod] = React.useState(
    SUMMARY_PERIOD_ENUM.WEEK
  );

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
    if (!trendId) return;
    void detailHook.execute({
      type: SUMMARY_DETAIL_TYPE_ENUM.TREND,
      trendId,
      period: selectedPeriod,
    });
    void pinsListHook.execute();
  }, [trendId, selectedPeriod]);

  const formatChartLabel = (
    dateStr: string,
    period: SUMMARY_PERIOD_ENUM
  ): string => {
    try {
      switch (period) {
        case SUMMARY_PERIOD_ENUM.DAY: {
          // dateStr is like "2025-12-19 14"
          const hour = dateStr.split(' ')[1];
          return `${hour}h`;
        }
        case SUMMARY_PERIOD_ENUM.WEEK:
          // dateStr is like "2025-12-19"
          return format(new Date(dateStr), 'EEE'); // Mon, Tue, etc.
        case SUMMARY_PERIOD_ENUM.MONTH:
          // dateStr is like "2025-12-19"
          return format(new Date(dateStr), 'dd'); // 01, 02, etc.
        case SUMMARY_PERIOD_ENUM.HALF_YEAR:
        case SUMMARY_PERIOD_ENUM.YEAR: {
          // dateStr is like "2025-12"
          const [year, month] = dateStr.split('-');
          return format(
            new Date(parseInt(year, 10), parseInt(month, 10) - 1),
            'MMM'
          ); // Jan, Feb, etc.
        }
        default:
          return dateStr;
      }
    } catch {
      return dateStr;
    }
  };

  const chartValues = detailHook.items.series.map((item) => ({
    value: formatChartLabel(item.date, selectedPeriod),
    count: item.value,
  }));
  const hasSeries = detailHook.items.series.length > 0;

  const isPinned = pinsListHook.items.some(
    (pin) =>
      pin.type === SUMMARY_PIN_TYPE_ENUM.TREND && pin.targetId === trendId
  );

  const handlePinToggle = async () => {
    if (isPinned) {
      await unpinHook.execute({
        type: SUMMARY_PIN_TYPE_ENUM.TREND,
        targetId: trendId,
      });
      return;
    }

    await pinHook.execute({
      type: SUMMARY_PIN_TYPE_ENUM.TREND,
      targetId: trendId,
    });
  };

  const periodOptions = SUMMARY_PERIOD_VALUES.map((period) => ({
    value: period,
    labelKey: SUMMARY_PERIOD_I18N_MAP[period],
  }));

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
        <View className="gap-4">
          <SummaryPeriodSelector
            options={periodOptions}
            selected={selectedPeriod}
            onSelect={(value) =>
              setSelectedPeriod(value as SUMMARY_PERIOD_ENUM)
            }
            testID="page.summary-detail.period"
          />

          <CardAtom className="p-4 rounded-lg">
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
                  showAxisLabels={true}
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

          <CardAtom className="p-4 rounded-lg">
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
            descriptionKey={detailHook.items.descriptionKey as Ti18nKeys}
            iconName="flame"
            metricValue={detailHook.items.average ?? 0}
            metricLabel=""
            chartValues={detailHook.items.series.map((item) => item.value)}
            chartAverage={detailHook.items.average}
            testID="page.summary-detail.insight"
          />

          <CardAtom className="p-0 rounded-lg">
            <View className="p-4">
              <SummarySectionHeader
                titleKey="page.summary-detail.actions"
                testID="page.summary-detail.actions"
              />
            </View>
            <View className="px-4 pb-4 gap-2">
              <RowAction
                iconName={isPinned ? 'bookmark' : 'bookmark-outline'}
                title={
                  isPinned
                    ? 'page.summary-detail.unpin'
                    : 'page.summary-detail.pin'
                }
                onPress={handlePinToggle}
                testID="page.summary-detail.pin-toggle"
              />
              <RowAction
                iconName="home"
                title="page.summary-detail.back-to-summary"
                onPress={goToSummaryHome}
                testID="page.summary-detail.back-to-summary"
              />
            </View>
          </CardAtom>
        </View>
        <RowEmptyAtom />
      </ScrollView>
    </ScreenLayout>
  );
}
