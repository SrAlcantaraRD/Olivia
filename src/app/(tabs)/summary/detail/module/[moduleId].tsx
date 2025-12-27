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
import { CardAtom } from '@/ui/components/atoms/card.atom';
import { RowEmptyAtom } from '@/ui/components/atoms/row-empty.atom';
import {
  TypographyParagraph,
  TypographySmall,
} from '@/ui/components/atoms/typography.atom';
import { ScreenLayout } from '@/ui/components/layouts/screen.layout';
import { RowAction } from '@/ui/components/molecules/row-action.molecule';
import { SummaryCard } from '@/ui/components/molecules/summary-card.molecule';
import { SummaryInsightCard } from '@/ui/components/molecules/summary-insight-card.molecule';
import { SummaryPeriodSelector } from '@/ui/components/molecules/summary-period-selector.molecule';
import { SummarySectionHeader } from '@/ui/components/molecules/summary-section-header.molecule';
import { SummaryTrendChart } from '@/ui/components/molecules/summary-trend-chart.molecule';
import { useNavigation } from '@/ui/hook/use-navigation.hook';
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
        <View className="gap-4">
          <SummaryPeriodSelector
            options={periodOptions}
            selected={selectedPeriod}
            onSelect={(value) =>
              setSelectedPeriod(value as SUMMARY_PERIOD_ENUM)
            }
            testID="page.summary-detail.period"
          />

          <CardAtom className="rounded-lg overflow-hidden">
            <SummaryTrendChart
              average={detailHook.items.average ?? 0}
              series={detailHook.items.series}
              period={selectedPeriod}
              testID="page.summary-detail.trend-chart"
            />
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

          <View className="gap-2">
            <SummarySectionHeader
              titleKey="page.summary-detail.actions"
              testID="page.summary-detail.actions"
            />
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
          </View>

          <View className="gap-2">
            <SummarySectionHeader
              titleKey="page.summary-detail.fields"
              testID="page.summary-detail.fields"
            />
            {detailHook.items.fieldSummaries &&
            detailHook.items.fieldSummaries.length > 0 ? (
              detailHook.items.fieldSummaries.map((field) => (
                <SummaryCard
                  key={`summary-field-${field.id}`}
                  title={field.code}
                  metricValue={field.todayValue ?? 0}
                  metricLabel={t('page.summary.metric-label.today')}
                  timeLabel=""
                  iconName="flame"
                  chartValues={field.series}
                  chartAverage={field.average}
                  fieldType={field.type}
                  onPress={() =>
                    goToSummaryFieldDetail(String(moduleId), String(field.id))
                  }
                  testID={`page.summary-detail.field.${field.id}`}
                />
              ))
            ) : fieldsHook.items.length === 0 ? (
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
                  title={field.code}
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
        <RowEmptyAtom />
      </ScrollView>
    </ScreenLayout>
  );
}
