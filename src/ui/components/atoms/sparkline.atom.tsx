// no direct React import required for modern JSX runtime
import { View } from 'react-native';
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
  if (!data || data.length === 0) return <View style={{ height }} />;

  const chartData = data.map((v, i) => ({ value: v, label: `${i}` }));

  return (
    <View>
      <LineChart
        data={chartData}
        width={200}
        height={height}
        color={color}
        hideRules
        hideVerticalLines
        hideDataPoints
        startFillColor={color}
        endFillColor={color}
        noOfSections={0}
      />
    </View>
  );
}

export default Sparkline;
