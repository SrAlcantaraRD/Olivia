// no direct React import required for modern JSX runtime

import { useWindowDimensions, View } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';

import { BASE_LOGGER } from '@/domain/core/adapter/logger.adapter';

interface SparklineProps {
  data: number[];
  height?: number;
  color?: string;
}

export function Sparkline({
  data,
  height = 40,
  color = '#4f46e5',
}: SparklineProps) {
  const { width: windowWidth } = useWindowDimensions();
  // sanitize data: coerce to number and replace non-finite values with 0
  const sanitized: number[] = (data || []).map((v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  });

  // need at least two points for LineChart to render meaningfully
  if (sanitized.length < 2) return <View style={{ height }} />;

  // approximate width minus screen padding/margins (20 left + 20 right + card padding)
  const chartWidth = Math.max(200, windowWidth - 20 - 20 - 48);

  // build chart data; use empty labels to avoid rendering raw index values or NaN
  const chartData = sanitized.map((v) => ({ value: v, label: '' }));

  // debug only — avoid error-level noise
  BASE_LOGGER.debug({ chartData, chartWidth, height, color });

  return (
    <View>
      <LineChart
        data={chartData}
        width={chartWidth}
        height={height}
        color={color}
        hideRules
        showVerticalLines={false}
        hideDataPoints
        // remove heavy full-fill to avoid hiding thin lines on tiny heights
        // and avoid potential rendering issues when sections are zero
        initialSpacing={10}
        thickness={2}
        isAnimated={false}
        noOfSections={3}
      />
    </View>
  );
}
