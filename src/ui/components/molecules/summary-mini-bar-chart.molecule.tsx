import { useThemeColor } from 'heroui-native';
import { useState } from 'react';
import { View } from 'react-native';

import type { TTimeBucketItem } from '@/domain/summary/entity/summary-time-bucket.entity';
import { BarChartAtom } from '@/ui/components/atoms/chart.bar.atom';
import { TypographySmall } from '@/ui/components/atoms/typography.atom';

interface SummaryMiniBarChartProps {
  data: TTimeBucketItem[];
  average?: number | null;
  height?: number;
  showLabels?: boolean;
  labels?: string[];
  highlightLastBar?: boolean;
  testID: string;
}

export function SummaryMiniBarChart({
  data,
  average,
  height = 64,
  showLabels = true,
  labels,
  highlightLastBar = true,
  testID,
}: SummaryMiniBarChartProps) {
  const accentColor = useThemeColor('accent');
  const mutedColor = useThemeColor('muted');
  const [containerWidth, setContainerWidth] = useState<number | null>(null);

  const values = data.map((bucket) => bucket.value);
  const safeValues = values.length > 0 ? values : [0];
  const max = Math.max(...safeValues, 1);
  const avg = typeof average === 'number' ? average : null;
  const avgRatio = avg !== null ? Math.min(avg / max, 1) : null;

  const barValues = values.map((value) => ({ value: '', count: value }));
  const barColors = values.map((_, index) => {
    if (highlightLastBar && index === values.length - 1) return accentColor;
    return mutedColor;
  });

  return (
    <View testID={testID} className="w-full">
      <View
        className="w-full"
        style={{ height }}
        onLayout={({ nativeEvent }) =>
          setContainerWidth(nativeEvent.layout.width - 16)
        }
      >
        {containerWidth ? (
          <BarChartAtom
            values={barValues}
            height={height}
            width={containerWidth}
            color={mutedColor}
            secondaryColor={mutedColor}
            barColors={barColors}
            showAxisLabels={false}
            testID={`${testID}.bars`}
          />
        ) : (
          <View style={{ height }} />
        )}
        {avgRatio !== null && (
          <View
            style={{
              position: 'absolute',
              left: 8,
              right: 8,
              height: 3,
              backgroundColor: accentColor,
              top: height - height * avgRatio - 1,
              borderRadius: 4,
            }}
          />
        )}
      </View>

      {showLabels && (
        <View className="flex-row justify-between px-2 mt-2">
          {labels?.map((label) => (
            <View key={`${testID}.label.${label}`} className="flex-1">
              <TypographySmall
                testID={`${testID}.label.${label}`}
                i18nKey="common.raw-value"
                values={{ value: label }}
                className="text-center"
                variant="light"
                size="xs"
              />
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
