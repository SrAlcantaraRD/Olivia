import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { useAdapters } from '@/adapter';
import {
  SUMMARY_PERIOD_ENUM,
  SUMMARY_PERIOD_I18N_MAP,
  SUMMARY_PERIOD_VALUES,
} from '@/domain/summary/enum/summary-period.enum';
import { useGetSummaryModuleDetailByPeriod } from '@/domain/summary/hook/use-get-summary-module-detail-by-period.hook';
import { CardAtom } from '@/ui/components/atoms/card.atom';
import {
  TypographyParagraph,
  TypographySmall,
} from '@/ui/components/atoms/typography.atom';
import { SummaryInsightCard } from '@/ui/components/molecules/summary-insight-card.molecule';
import { SummaryPeriodSelector } from '@/ui/components/molecules/summary-period-selector.molecule';
import { SummaryTrendChart } from '@/ui/components/molecules/summary-trend-chart.molecule';

interface SummaryModuleTrendSectionProps {
  moduleID: number;
  testID?: string;
}

export const SummaryModuleTrendSection = ({
  moduleID,
  testID = 'page.summary-detail.trend',
}: SummaryModuleTrendSectionProps) => {
  const { t } = useTranslation();
  const {
    moduleAdapter,
    moduleFieldAdapter,
    recordAdapter,
    recordFieldAdapter,
    notifyAdapter,
    loggerAdapter,
    cacheAdapter,
    summaryAdapter,
  } = useAdapters();

  const [selectedPeriod, setSelectedPeriod] = useState(
    SUMMARY_PERIOD_ENUM.WEEK
  );

  const {
    items: summaryModule,
    execute,
    isExecuting,
  } = useGetSummaryModuleDetailByPeriod({
    loggerAdapter,
    notifyAdapter,
    cacheAdapter,
    moduleAdapter,
    moduleFieldAdapter,
    recordFieldAdapter,
    recordAdapter,
    summaryAdapter,
  });

  const handlerLoadData = useCallback(async () => {
    await execute({
      period: selectedPeriod,
      moduleID,
    });
  }, [moduleID, selectedPeriod]);

  useEffect(() => {
    handlerLoadData();
  }, []);

  const periodOptions = useMemo(
    () =>
      SUMMARY_PERIOD_VALUES.map((period) => ({
        value: period,
        labelKey: SUMMARY_PERIOD_I18N_MAP[period],
      })),
    []
  );

  const chartSeries = useMemo(
    () =>
      summaryModule.groupedData?.buckets?.map((bucket) => ({
        date: bucket.timestamp.toISOString(),
        value: bucket.value,
      })) ?? [],
    [summaryModule]
  );

  const totalCount = summaryModule.groupedData?.metadata.totalCount ?? 0;
  const bucketCount = summaryModule.groupedData?.buckets?.length ?? 0;
  const averageValue =
    bucketCount > 0 && summaryModule.statistics?.lastRecordedAt
      ? totalCount / bucketCount
      : 0;

  const percentageChange =
    summaryModule.statistics?.percentageChange ?? undefined;

  const formattedTrendValue =
    percentageChange !== undefined
      ? `${percentageChange > 0 ? '+' : ''}${percentageChange.toFixed(1)}%`
      : '-';

  return (
    <View className="gap-4" testID={testID}>
      <SummaryPeriodSelector
        options={periodOptions}
        selected={selectedPeriod}
        onSelect={(value) => setSelectedPeriod(value as SUMMARY_PERIOD_ENUM)}
        testID={`${testID}.period`}
      />

      <CardAtom className="rounded-lg overflow-hidden">
        <SummaryTrendChart
          average={averageValue}
          series={chartSeries}
          period={selectedPeriod}
          testID={`${testID}.trend-chart`}
        />
      </CardAtom>

      <CardAtom className="p-4 rounded-lg">
        <View className="flex-row items-center justify-between">
          <TypographyParagraph
            testID={`${testID}.trend`}
            i18nKey="page.summary-detail.trend"
          />
          <TypographySmall
            testID={`${testID}.trend-value`}
            variant="light"
            i18nKey="common.raw-value"
            values={{
              value: formattedTrendValue,
            }}
          />
        </View>
      </CardAtom>

      <SummaryInsightCard
        titleKey="page.summary-detail.highlights"
        descriptionKey="page.summary-detail.trend"
        iconName="flame"
        metricValue={totalCount}
        metricLabel={t('page.summary.metric-label.total')}
        chartValues={chartSeries.map((item) => item.value)}
        chartAverage={averageValue}
        testID={`${testID}.insight`}
      />
    </View>
  );
};
