import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from 'heroui-native';
import type React from 'react';
import { View } from 'react-native';
import { withUniwind } from 'uniwind';

import { MODULE_FIELD_TYPE_ENUM } from '@/domain/module/enum/module-field-type.enum';
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

const StyledIonicons = withUniwind(Ionicons);

interface SummaryCardProps {
  title: string;
  metricValue: number | string;
  metricLabel: string;
  timeLabel?: string;
  iconName?: IconName;
  chartValues?: number[] | { label: string; count: number }[];
  chartAverage?: number | null;
  showAverageLine?: boolean;
  highlightLastBar?: boolean;
  fieldType?: MODULE_FIELD_TYPE_ENUM;
  onPress?: () => void;
  testID: string;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  metricValue,
  metricLabel,
  timeLabel,
  iconName,
  chartValues = [],
  chartAverage,
  showAverageLine = false,
  fieldType,
  onPress,
  testID,
}) => {
  const accentColor = useThemeColor('accent');
  const mutedColor = useThemeColor('muted');
  const foregroundColor = useThemeColor('foreground');

  return (
    <CardAtom className="p-4" onPress={onPress}>
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center gap-2">
          {iconName && (
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
                name={iconName}
                size={18}
                style={{ color: accentColor }}
              />
            </View>
          )}
          <TypographyTitle
            testID={`${testID}.title`}
            i18nKey="common.raw-value"
            values={{ value: title }}
            className="font-semibold text-lg"
            variant="default"
          />
        </View>

        <View className="flex-row items-center gap-2">
          {timeLabel && (
            <TypographySmall
              testID={`${testID}.time`}
              i18nKey="common.raw-value"
              values={{ value: timeLabel }}
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
              values={{ value: metricValue }}
              className="text-4xl"
              style={{ color: foregroundColor }}
            />
            <TypographyParagraph
              testID={`${testID}.metric-label`}
              i18nKey="common.raw-value"
              values={{ value: metricLabel }}
              variant="light"
              className="text-base"
            />
          </View>
        </View>

        <View className="flex-[1.3] items-end justify-center">
          {fieldType === MODULE_FIELD_TYPE_ENUM.SELECT &&
          Array.isArray(chartValues) &&
          chartValues.length > 0 &&
          typeof chartValues[0] === 'object' ? (
            <SummaryMiniPieChart
              data={chartValues as { label: string; count: number }[]}
              testID={`${testID}.chart.pie`}
            />
          ) : (
            <SummaryMiniBarChart
              testID={`${testID}.chart.bar`}
              values={
                Array.isArray(chartValues) && typeof chartValues[0] === 'number'
                  ? (chartValues as number[])
                  : []
              }
              average={showAverageLine ? (chartAverage ?? null) : null}
              showLabels={false}
              highlightLastBar
            />
          )}
        </View>
      </View>
    </CardAtom>
  );
};
