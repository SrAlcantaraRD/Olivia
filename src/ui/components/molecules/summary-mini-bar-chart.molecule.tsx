import { useThemeColor } from 'heroui-native';
import { View } from 'react-native';

import { TypographySmall } from '@/ui/components/atoms/typography.atom';

interface SummaryMiniBarChartProps {
  values: number[];
  average?: number | null;
  height?: number;
  showLabels?: boolean;
  labels?: string[];
  testID: string;
}

export function SummaryMiniBarChart({
  values,
  average,
  height = 72,
  showLabels = true,
  labels,
  testID,
}: SummaryMiniBarChartProps) {
  const accentColor = useThemeColor('accent');
  const mutedColor = useThemeColor('muted');
  const backgroundColor = useThemeColor('background');

  const safeValues = values.length > 0 ? values : [0];
  const max = Math.max(...safeValues, 1);
  const avg = typeof average === 'number' ? average : null;
  const avgRatio = avg !== null ? Math.min(avg / max, 1) : null;

  const barLabels =
    labels && labels.length === values.length
      ? labels
      : ['D', 'L', 'M', 'X', 'J', 'V', 'S'].slice(0, values.length);

  return (
    <View testID={testID} className="w-full">
      <View
        className="w-full justify-end"
        style={{ height, backgroundColor, borderRadius: 12 }}
      >
        {avgRatio !== null && (
          <View
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              height: 3,
              backgroundColor: accentColor,
              top: height - height * avgRatio - 1,
              borderRadius: 4,
            }}
          />
        )}
        <View className="flex-row items-end px-2 gap-2 h-full">
          {values.map((value, index) => {
            const ratio = Math.max(0, value) / max;
            const barHeight = Math.max(6, Math.round(height * ratio));

            return (
              <View
                key={`${testID}.bar.${index}`}
                className="flex-1"
                style={{
                  height: barHeight,
                  borderRadius: 6,
                  backgroundColor: mutedColor,
                  opacity: 0.7,
                }}
              />
            );
          })}
        </View>
      </View>

      {showLabels && (
        <View className="flex-row justify-between px-2 mt-2">
          {barLabels.map((label, index) => (
            <View key={`${testID}.label.${index}`} className="flex-1">
              <TypographySmall
                testID={`${testID}.label.${label}`}
                i18nKey="common.raw-value"
                values={{ value: label }}
                className="text-center"
                variant="light"
              />
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
