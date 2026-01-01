import { useCallback, useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';

import { useAdapters } from '@/adapter';
import type { TID } from '@/domain/core/schemas/id.schema';
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
  testID: string;
}

export const SummaryModuleTrendSection = ({
  moduleID,
  testID,
}: SummaryModuleTrendSectionProps) => {
  const {
    cacheAdapter,
    loggerAdapter,
    notifyAdapter,
    summaryModuleAdapter,
    summaryModuleFieldAdapter,
  } = useAdapters();

  const [selectedPeriod, setSelectedPeriod] = useState(
    SUMMARY_PERIOD_ENUM.WEEK
  );

  const { items: summaryModule, execute } = useGetSummaryModuleDetailByPeriod({
    cacheAdapter,
    summaryModuleAdapter,
    notifyAdapter,
    loggerAdapter,
    summaryModuleFieldAdapter,
  });

  const handlerLoadData = useCallback(
    async (moduleID: TID, period: SUMMARY_PERIOD_ENUM) => {
      await execute({
        period,
        moduleID,
      });
    },
    []
  );

  useEffect(() => {
    handlerLoadData(moduleID, selectedPeriod);
  }, [selectedPeriod, moduleID]);

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
      <View className="gap-2">
        <SummaryPeriodSelector
          options={periodOptions}
          selected={selectedPeriod}
          onSelect={(value) => setSelectedPeriod(value)}
          testID={`${testID}.period`}
        />

        <SummaryTrendChart
          average={averageValue}
          series={chartSeries}
          period={selectedPeriod}
          testID={`${testID}.trend-chart`}
        />
      </View>

      <CardAtom className="p-4 rounded-lg" testID={`${testID}.trend-card`}>
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
        metricLabel="page.summary.metric-label.total"
        data={summaryModule.groupedData.buckets}
        chartAverage={averageValue}
        testID={`${testID}.insight`}
      />
    </View>
  );
};
