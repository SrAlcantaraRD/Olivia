import { View } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';

interface PieChartProps {
  values: { value: string; count: number }[];
  height?: number;
}

const defaultColors = [
  '#4f46e5',
  '#f97316',
  '#22c55e',
  '#06b6d4',
  '#ef4444',
  '#a78bfa',
  '#f59e0b',
];

export function PieChartAtom({ values, height = 220 }: PieChartProps) {
  if (!values || values.length === 0) return <View style={{ height }} />;

  // const total = values.reduce((s, v) => s + v.count, 0); // kept if needed later
  const sliced = values.slice(0, 7);
  const data = sliced.map((v, i) => ({
    label: v.value,
    value: v.count,
    color: defaultColors[i % defaultColors.length],
  }));

  // if more values than colors, aggregate remainder in 'Other'
  if (values.length > 7) {
    const rest = values.slice(7).reduce((s, v) => s + v.count, 0);
    data.push({ label: 'Other', value: rest, color: '#d1d5db' });
  }

  return (
    <View style={{ height }}>
      <PieChart
        data={data}
        innerRadius={40}
        donut
        showText
        showValuesAsLabels
      />
    </View>
  );
}

export default PieChartAtom;
