import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from 'heroui-native';
import type React from 'react';
import { Pressable, View } from 'react-native';
import { withUniwind } from 'uniwind';

import { CardAtom } from '@/ui/components/atoms/card.atom';
import type { IconName } from '@/ui/components/atoms/icon.atom';
import {
  TypographyParagraph,
  TypographySmall,
} from '@/ui/components/atoms/typography.atom';
import { SummaryMiniBarChart } from '@/ui/components/molecules/summary-mini-bar-chart.molecule';
import type { Ti18nKeys } from '@/ui/i18n/locales/en-EN';

const StyledIonicons = withUniwind(Ionicons);

interface SummaryInsightCardProps {
  titleKey: Ti18nKeys;
  descriptionKey: Ti18nKeys;
  iconName?: IconName;
  metricValue?: number | string;
  metricLabel?: string;
  chartValues?: number[];
  chartAverage?: number | null;
  onPress?: () => void;
  testID: string;
}

export const SummaryInsightCard: React.FC<SummaryInsightCardProps> = ({
  titleKey,
  descriptionKey,
  iconName,
  metricValue,
  metricLabel,
  chartValues = [],
  chartAverage,
  onPress,
  testID,
}) => {
  const accentColor = useThemeColor('accent');
  const mutedColor = useThemeColor('muted');

  return (
    <CardAtom className="p-4 rounded-lg">
      <Pressable
        accessibilityRole="button"
        onPress={onPress}
        style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            {iconName && (
              <View
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: `${accentColor}20`,
                }}
              >
                <StyledIonicons
                  name={iconName}
                  size={16}
                  style={{ color: accentColor }}
                />
              </View>
            )}
            <TypographyParagraph
              testID={`${testID}.title`}
              i18nKey={titleKey}
            />
          </View>
          <StyledIonicons
            name="chevron-forward"
            size={16}
            style={{ color: mutedColor }}
          />
        </View>

        <View className="mt-3">
          <TypographyParagraph
            testID={`${testID}.description`}
            i18nKey={descriptionKey}
            className="text-base"
          />
        </View>

        <View className="mt-4 flex-row items-end gap-4">
          {metricValue !== undefined && (
            <View className="flex-1">
              <TypographyParagraph
                testID={`${testID}.metric`}
                i18nKey="common.raw-value"
                values={{ value: metricValue }}
              />
              {metricLabel && (
                <TypographySmall
                  testID={`${testID}.metric-label`}
                  i18nKey="common.raw-value"
                  values={{ value: metricLabel }}
                  variant="light"
                />
              )}
            </View>
          )}
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
