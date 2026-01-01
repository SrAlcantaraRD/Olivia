import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ScrollView, View } from 'react-native';

import { useAdapters } from '@/adapter';
import {
  SUMMARY_PERIOD_ENUM,
  SUMMARY_PERIOD_I18N_MAP,
  SUMMARY_PERIOD_VALUES,
} from '@/domain/summary/enum/summary-period.enum';
import { CardAtom } from '@/ui/components/atoms/card.atom';
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
import { SummaryTrendChart } from '@/ui/components/molecules/summary-trend-chart.molecule';
import { useNavigation } from '@/ui/hook/use-navigation.hook';

export default function SummaryFieldDetailScreen() {
  const params = useLocalSearchParams<{
    moduleId?: string;
    fieldId?: string;
  }>();
  const moduleId = Number(params.moduleId ?? 0);
  const fieldId = Number(params.fieldId ?? 0);

  const { navigationAdapter } = useAdapters();

  const { goToSummaryModuleDetail, goToSummaryFieldRecords } = useNavigation({
    navigationAdapter,
  });

  const [selectedPeriod, setSelectedPeriod] = React.useState(
    SUMMARY_PERIOD_ENUM.WEEK
  );

  const periodOptions = SUMMARY_PERIOD_VALUES.map((period) => ({
    value: period,
    labelKey: SUMMARY_PERIOD_I18N_MAP[period],
  }));

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
        <View className="gap-4">
          <SummaryPeriodSelector
            options={periodOptions}
            selected={selectedPeriod}
            onSelect={(value) =>
              setSelectedPeriod(value as SUMMARY_PERIOD_ENUM)
            }
            testID="page.summary-detail.period"
          />

          <CardAtom
            className="p-4 rounded-lg"
            testID="page.summary-detail.summary-card"
          >
            <TypographySmall
              testID="page.summary-detail.average-label"
              i18nKey="page.summary-detail.average-label"
              variant="light"
            />
            <TypographyHeading
              testID="page.summary-detail.average-value"
              i18nKey="common.raw-value"
              values={{ value: -1 }}
            />
            <TypographySmall
              testID="page.summary-detail.range"
              i18nKey="page.summary-detail.range-placeholder"
              variant="light"
            />
            <SummaryTrendChart
              average={-1}
              series={[]}
              period={selectedPeriod}
              testID="page.summary-detail.trend-chart"
            />
          </CardAtom>

          <CardAtom
            className="p-4 rounded-lg"
            testID="page.summary-detail.trend-card"
          >
            <View className="flex-row items-center justify-between">
              <TypographyParagraph
                testID="page.summary-detail.trend"
                i18nKey="page.summary-detail.trend"
              />
              <TypographySmall
                testID="page.summary-detail.trend-value"
                variant="light"
                i18nKey="page.summary-detail.trend-empty"
              />
            </View>
          </CardAtom>

          <SummaryInsightCard
            testID="page.summary-detail.insight"
            titleKey="page.summary-detail.highlights"
            descriptionKey="page.summary-detail.trend"
            iconName="flame"
            metricValue={-1}
            metricLabel="page.summary.metric-label.total"
            data={[]}
            chartAverage={-1}
          />

          <CardAtom
            className="p-0 rounded-lg"
            testID="page.summary-detail.actions-card"
          >
            <View className="p-4">
              <SummarySectionHeader
                titleKey="page.summary-detail.actions"
                testID="page.summary-detail.actions"
              />
            </View>
            <View className="px-4 pb-4 gap-2">
              <RowAction
                iconName="bookmark-outline"
                title="page.summary-detail.pin"
                testID="page.summary-detail.pin-toggle"
                onPress={() => {}}
              />
              <RowAction
                iconName="list"
                title="common.view-all"
                onPress={() =>
                  goToSummaryFieldRecords(String(moduleId), String(fieldId))
                }
                testID="page.summary-detail.view-all-records"
              />
              <RowAction
                iconName="arrow-back"
                title="page.summary-detail.back-to-module"
                onPress={() => goToSummaryModuleDetail(String(moduleId))}
                testID="page.summary-detail.back-to-module"
              />
            </View>
          </CardAtom>
        </View>
        <RowEmptyAtom />
      </ScrollView>
    </ScreenLayout>
  );
}
