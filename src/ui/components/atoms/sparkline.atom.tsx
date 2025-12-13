// no direct React import required for modern JSX runtime
import { useWindowDimensions, View } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';

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
  if (!data || data.length === 0) return <View style={{ height }} />;

  // approximate width minus screen padding/margins (20 left + 20 right + card padding)
  const chartWidth = Math.max(200, windowWidth - 20 - 20 - 48);

  const chartData = data.map((v, i) => ({ value: v, label: `${i}` }));
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
        startFillColor={color}
        endFillColor={color}
        noOfSections={0}
      />
    </View>
  );
}
