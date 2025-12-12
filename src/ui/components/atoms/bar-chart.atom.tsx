import { View } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';

interface BarChartProps {
  values: { value: string; count: number }[];
  height?: number;
  color?: string;
}

export function BarChartAtom({
  values,
  height = 220,
  color = '#4f46e5',
}: BarChartProps) {
  if (!values || values.length === 0) return <View style={{ height }} />;

  const sliced = values.slice(0, 20); // limit for readability
  const data = sliced.map((v) => ({ value: v.count, label: v.value }));

  return (
    <View style={{ height }}>
      <BarChart
        data={data}
        height={height}
        barWidth={16}
        spacing={8}
        color={color}
        frontColor={color}
      />
    </View>
  );
}

export default BarChartAtom;
