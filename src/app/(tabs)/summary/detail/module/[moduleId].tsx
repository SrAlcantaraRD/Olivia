import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';

import { useAdapters } from '@/adapter';
import { BASE_LOGGER } from '@/domain/core/adapter/logger.adapter';
import { useGetListModuleField } from '@/domain/module/hook/get-list-module-field.hook';
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
import { useNavigation } from '@/hooks/use-navigation.hook';
import { BarChartAtom } from '@/ui/components/atoms/bar-chart.atom';
import { CardAtom } from '@/ui/components/atoms/card.atom';
import {
  TypographyHeading,
  TypographyParagraph,
  TypographySmall,
} from '@/ui/components/atoms/typography.atom';
import { ScreenLayout } from '@/ui/components/layouts/screen.layout';
import { SummaryCard } from '@/ui/components/molecules/summary-card.molecule';
import { SummaryInsightCard } from '@/ui/components/molecules/summary-insight-card.molecule';
import { SummaryPeriodSelector } from '@/ui/components/molecules/summary-period-selector.molecule';
import { SummaryRow } from '@/ui/components/molecules/summary-row.molecule';
import { SummarySectionHeader } from '@/ui/components/molecules/summary-section-header.molecule';
import type { Ti18nKeys } from '@/ui/i18n/locales/en-EN';

export default function SummaryModuleDetailScreen() {
  const { t } = useTranslation();
  const params = useLocalSearchParams<{ moduleId?: string }>();
  const moduleId = Number(params.moduleId ?? 0);

  const {
    summaryDetailAdapter,
    notifyAdapter,
    moduleFieldAdapter,
    navigationAdapter,
    summaryPinsAdapter,
  } = useAdapters();

  const { goToSummaryFieldDetail } = useNavigation({ navigationAdapter });

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

  const fieldsHook = useGetListModuleField({
    loggerAdapter: BASE_LOGGER,
    moduleFieldAdapter,
    notifyAdapter,
  });

  const [selectedPeriod, setSelectedPeriod] = React.useState(
    SUMMARY_PERIOD_ENUM.WEEK
  );

  React.useEffect(() => {
    if (!moduleId) return;
    void detailHook.execute({
      type: SUMMARY_DETAIL_TYPE_ENUM.MODULE,
      moduleId,
      period: selectedPeriod,
    });
    void fieldsHook.execute({ moduleID: moduleId });
    void pinsListHook.execute();
  }, [moduleId, selectedPeriod]);

  const chartValues = detailHook.items.series.map((item) => ({
    value: '',
    count: item.value,
  }));

  const isPinned = pinsListHook.items.some(
    (pin) =>
      pin.type === SUMMARY_PIN_TYPE_ENUM.MODULE &&
      pin.targetId === String(moduleId)
  );

  const handlePinToggle = async () => {
    if (isPinned) {
      await unpinHook.execute({
        type: SUMMARY_PIN_TYPE_ENUM.MODULE,
        targetId: String(moduleId),
      });
      return;
    }

    await pinHook.execute({
      type: SUMMARY_PIN_TYPE_ENUM.MODULE,
      targetId: String(moduleId),
    });
  };
  const periodOptions = SUMMARY_PERIOD_VALUES.map((period) => ({
    value: period,
    labelKey: SUMMARY_PERIOD_I18N_MAP[period],
  }));

  const hasSeries = detailHook.items.series.length > 0;

  return (
    <ScreenLayout
      testID="page.summary-detail-module"
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
            options={periodOptions}
            selected={selectedPeriod}
            onSelect={(value) =>
              setSelectedPeriod(value as SUMMARY_PERIOD_ENUM)
            }
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
            descriptionKey={detailHook.items.descriptionKey as Ti18nKeys}
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
            </View>
          </CardAtom>

          <View className="gap-3">
            <SummarySectionHeader
              titleKey="page.summary-detail.fields"
              testID="page.summary-detail.fields"
            />
            {fieldsHook.items.length === 0 ? (
              <CardAtom>
                <TypographySmall
                  testID="page.summary-detail.fields-empty"
                  i18nKey="page.summary-detail.fields-empty"
                  variant="light"
                />
              </CardAtom>
            ) : (
              fieldsHook.items.map((field) => (
                <SummaryCard
                  key={`summary-field-${field.id}`}
                  title={field.title}
                  metricValue={detailHook.items.todayValue ?? 0}
                  metricLabel={t('page.summary.metric-label.today')}
                  timeLabel=""
                  iconName="flame"
                  chartValues={detailHook.items.series.map(
                    (item) => item.value
                  )}
                  chartAverage={detailHook.items.average}
                  onPress={() =>
                    goToSummaryFieldDetail(String(moduleId), String(field.id))
                  }
                  testID={`page.summary-detail.field.${field.id}`}
                />
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </ScreenLayout>
  );
}
