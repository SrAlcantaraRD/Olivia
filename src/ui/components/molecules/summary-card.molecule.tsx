import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from 'heroui-native';
import type React from 'react';
import { Pressable, View } from 'react-native';
import { withUniwind } from 'uniwind';

import { CardAtom } from '@/ui/components/atoms/card.atom';
import type { IconName } from '@/ui/components/atoms/icon.atom';
import {
  TypographyHeading,
  TypographyParagraph,
  TypographySmall,
} from '@/ui/components/atoms/typography.atom';
import { SummaryMiniBarChart } from '@/ui/components/molecules/summary-mini-bar-chart.molecule';

const StyledIonicons = withUniwind(Ionicons);

interface SummaryCardProps {
  title: string;
  metricValue: number | string;
  metricLabel: string;
  timeLabel?: string;
  iconName?: IconName;
  chartValues?: number[];
  chartAverage?: number | null;
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
  onPress,
  testID,
}) => {
  const accentColor = useThemeColor('accent');
  const mutedColor = useThemeColor('muted');
  const foregroundColor = useThemeColor('foreground');

  return (
    <CardAtom className="p-4 rounded-3xl">
      <Pressable
        accessibilityRole="button"
        onPress={onPress}
        style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
      >
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center gap-3">
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
            <TypographyParagraph
              testID={`${testID}.title`}
              i18nKey="common.raw-value"
              values={{ value: title }}
              className="font-semibold"
            />
          </View>

          <View className="flex-row items-center gap-2">
            {timeLabel && (
              <TypographySmall
                testID={`${testID}.time`}
                i18nKey="common.raw-value"
                values={{ value: timeLabel }}
                variant="light"
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
            <TypographyHeading
              testID={`${testID}.metric`}
              i18nKey="common.raw-value"
              values={{ value: metricValue }}
              className="text-3xl"
              style={{ color: foregroundColor }}
            />
            <TypographySmall
              testID={`${testID}.metric-label`}
              i18nKey="common.raw-value"
              values={{ value: metricLabel }}
              variant="light"
            />
          </View>

          <View className="flex-[1.4]">
            <SummaryMiniBarChart
              testID={`${testID}.chart`}
              values={chartValues}
              average={chartAverage ?? null}
              showLabels
            />
          </View>
        </View>
      </Pressable>
    </CardAtom>
  );
};
