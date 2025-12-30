import { Ionicons } from '@expo/vector-icons';
import { getHours, getMinutes, isToday } from 'date-fns';
import { useThemeColor } from 'heroui-native';
import type React from 'react';
import { View } from 'react-native';
import { withUniwind } from 'uniwind';

import type { MODULE_FIELD_TYPE_ENUM } from '@/domain/module/enum/module-field-type.enum';
import { MODULE_KEY_ENUM } from '@/domain/module/enum/module-key.enum';
import type { TSummaryModule } from '@/domain/summary/entity/summary-module.entity';
import { CardAtom } from '@/ui/components/atoms/card.atom';
import type { IconName } from '@/ui/components/atoms/icon.atom';
import {
  TypographyHeading,
  TypographyParagraph,
  TypographySmall,
  TypographyTitle,
} from '@/ui/components/atoms/typography.atom';
import { SummaryMiniBarChart } from '@/ui/components/molecules/summary-mini-bar-chart.molecule';
import { SummaryMiniPieChart } from '@/ui/components/molecules/summary-mini-pie-chart.molecule';
import type { Ti18nKeys } from '@/ui/i18n/locales/en-EN';

const StyledIonicons = withUniwind(Ionicons);

export enum SummaryCardChartType {
  BAR = 'bar',
  PIE = 'pie',
}

interface SummaryCardProps {
  chartType: SummaryCardChartType;
  summary?: TSummaryModule;
  title?: string;
  metricValue?: number | string;
  metricLabel?: Ti18nKeys;
  timeValue?: string;
  iconName?: IconName;
  chartValues?: { label: Ti18nKeys; count: number }[];
  chartAverage?: number | null;
  showAverageLine?: boolean;
  highlightLastBar?: boolean;
  fieldType?: MODULE_FIELD_TYPE_ENUM;
  onPress?: () => void;
  testID: string;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
  summary,
  title,
  metricValue,
  metricLabel,
  timeValue,
  iconName,
  chartAverage,
  chartType,
  showAverageLine = false,
  highlightLastBar,
  onPress,
  testID,
}) => {
  const accentColor = useThemeColor('accent');
  const mutedColor = useThemeColor('muted');
  const foregroundColor = useThemeColor('foreground');

  // Helper functions for summary processing
  const getModuleIcon = (key: string): IconName => {
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

  const getTimeLabel = (dateValue: Date) => {
    const hours = getHours(dateValue).toString().padStart(2, '0');
    const minutes = getMinutes(dateValue).toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const getTodayCount = (buckets: { timestamp: Date; value: number }[]) => {
    const todayBucket = buckets.find((b) => isToday(b.timestamp));
    return todayBucket?.value ?? 0;
  };

  // Derived values from summary if available
  const displayTitle = summary
    ? (summary.module.code as MODULE_KEY_ENUM)
    : title;
  const displayMetricValue = summary
    ? getTodayCount(summary.groupedData.buckets)
    : metricValue;
  const displayMetricLabel = summary
    ? 'page.summary.metric-label.today'
    : metricLabel;
  const displayTimeValue = summary?.statistics.lastRecordedAt
    ? getTimeLabel(summary.statistics.lastRecordedAt)
    : timeValue;
  const displayIconName = summary
    ? getModuleIcon(summary.module.code)
    : iconName;
  const displayChartAverage = summary
    ? summary.statistics.previousPeriodTotal > 0
      ? summary.statistics.previousPeriodTotal / 7
      : null
    : chartAverage;
  const data = summary?.groupedData.buckets ?? [];

  return (
    <CardAtom className="p-4" onPress={onPress}>
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center gap-2">
          {displayIconName && (
            <View
              style={{
                width: 32,
                height: 32,
                borderRadius: 12,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: `${accentColor}20`,
              }}
            >
              <StyledIonicons
                name={displayIconName}
                size={18}
                style={{ color: accentColor }}
              />
            </View>
          )}
          {displayTitle && (
            <TypographyTitle
              testID={`${testID}.title`}
              i18nKey="common.raw-value"
              values={{ value: displayTitle }}
              className="font-semibold text-lg"
              variant="default"
            />
          )}
        </View>

        <View className="flex-row items-center gap-2">
          {displayTimeValue && (
            <TypographySmall
              testID={`${testID}.time`}
              i18nKey="common.raw-value"
              values={{ value: displayTimeValue }}
              variant="light"
              className="text-xs"
            />
          )}
          <StyledIonicons
            name="chevron-forward"
            size={16}
            style={{ color: mutedColor }}
          />
        </View>
      </View>

      <View className="flex-row items-end justify-between gap-4">
        <View className="flex-1">
          <View className="flex-row items-end gap-2">
            <TypographyHeading
              testID={`${testID}.metric`}
              i18nKey="common.raw-value"
              values={{ value: displayMetricValue }}
              className="text-4xl"
              style={{ color: foregroundColor }}
            />
            {displayMetricLabel && (
              <TypographyParagraph
                testID={`${testID}.metric-label`}
                i18nKey={displayMetricLabel}
                variant="light"
                className="text-base"
              />
            )}
          </View>
        </View>

        <View className="flex-[1.3] items-end justify-center">
          {chartType === SummaryCardChartType.PIE ? (
            //TODO: Genearte a private function to map from values to chart data (pie vs bar), to avoid this magic cast. Also, we can wrapper chart components to avoid this logic here: summary-card-with-bar-chart.molecule.tsx nor summary-card-with-pie-chart.molecule.tsx
            <SummaryMiniPieChart testID={`${testID}.chart.pie`} data={data} />
          ) : (
            <SummaryMiniBarChart
              testID={`${testID}.chart.bar`}
              data={data}
              average={showAverageLine ? (displayChartAverage ?? null) : null}
              highlightLastBar={highlightLastBar}
            />
          )}
        </View>
      </View>
    </CardAtom>
  );
};
