import { Ionicons } from '@expo/vector-icons';
import { getHours, getMinutes } from 'date-fns';
import { useThemeColor } from 'heroui-native';
import type React from 'react';
import { withUniwind } from 'uniwind';

import { useAdapters } from '@/adapter';
import { BASE_LOGGER } from '@/domain/core/adapter/logger.adapter';
import { MODULE_KEY_ENUM } from '@/domain/module/enum/module-key.enum';
import type { TSummaryModule } from '@/domain/summary/entity/summary-module.entity';
import type { TSummaryPeriodResult } from '@/domain/summary/entity/summary-period.entity';
import { SUMMARY_PERIOD_ENUM } from '@/domain/summary/enum/summary-period.enum';
import { SummaryCard } from '@/ui/components/molecules/summary-card.molecule';
import { SummaryMiniBarChart } from '@/ui/components/molecules/summary-mini-bar-chart.molecule';
import { useNavigation } from '@/ui/hook/use-navigation.hook';

const StyledIonicons = withUniwind(Ionicons);

const formatTimeValue = (dateValue: Date) => {
  const hours = getHours(dateValue).toString().padStart(2, '0');
  const minutes = getMinutes(dateValue).toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

const getTodayCount = (summaryData: TSummaryPeriodResult) => {
  BASE_LOGGER.error({ buckets: summaryData });
  const dayOfWeek = new Date().getDay();
  BASE_LOGGER.error({ dayOfWeek });

  if (summaryData.period !== SUMMARY_PERIOD_ENUM.WEEK) return 0;

  const todayBucket = summaryData.buckets.find(
    (bucket) => bucket.dayOfWeek === dayOfWeek
  );

  BASE_LOGGER.error({ todayBucket, SS: todayBucket?.timestamp.getDay() });

  return todayBucket?.value ?? 0;
};

const getModuleIconName = (key: MODULE_KEY_ENUM) => {
  switch (key) {
    case MODULE_KEY_ENUM.URINE:
      return 'water';
    case MODULE_KEY_ENUM.STOOL:
      return 'nutrition';
    case MODULE_KEY_ENUM.MEDICATION:
      return 'medical';
    case MODULE_KEY_ENUM.ENEMA:
      return 'flame';
    default:
      return 'flame';
  }
};

export interface SummaryModuleCardProps {
  summary: TSummaryModule;
  testID: string;
}

export const SummaryModuleCard: React.FC<SummaryModuleCardProps> = ({
  summary,
  testID,
}) => {
  const { navigationAdapter } = useAdapters();

  const { goToSummaryModuleDetail } = useNavigation({
    navigationAdapter,
  });

  const iconColor = useThemeColor('accent');

  const resolvedMetricValue = getTodayCount(summary.groupedData);
  const resolvedMetricLabel = 'page.summary.metric-label.today';
  const resolvedTimeValue = summary.statistics.lastRecordedAt
    ? formatTimeValue(summary.statistics.lastRecordedAt)
    : undefined;
  const resolvedChartAverage = summary.statistics.previousPeriodTotal;

  const handlePress = () => {
    goToSummaryModuleDetail(String(summary.metadata.module.id));
  };

  return (
    <SummaryCard
      chartData={summary.groupedData.buckets}
      title={summary.metadata.module.code}
      metricValue={resolvedMetricValue}
      metricLabel={resolvedMetricLabel}
      timeValue={resolvedTimeValue}
      iconElement={
        <StyledIonicons
          name={getModuleIconName(summary.metadata.module.code)}
          size={18}
          style={{ color: iconColor }}
        />
      }
      chartAverage={resolvedChartAverage}
      onPress={handlePress}
      testID={testID}
      chartComponent={
        <SummaryMiniBarChart
          testID={`${testID}.chart.bar`}
          data={summary.groupedData.buckets}
          average={resolvedChartAverage}
          highlightLastBar
        />
      }
    />
  );
};
