import { useThemeColor } from 'heroui-native';
import { View } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';

interface PieChartProps {
  data: {
    value: number;
    color?: string;
    label?: string;
    text?: string;
  }[];
  radius?: number;
  innerRadius?: number;
  showText?: boolean;
  textColor?: string;
  textSize?: number;
  testID: string;
}

export function PieChartAtom({
  data,
  radius = 40,
  innerRadius = 20,
  showText = false,
  textColor,
  textSize = 10,
  testID,
}: PieChartProps) {
  const accentColor = useThemeColor('accent');
  const mutedColor = useThemeColor('muted');
  const surfaceColor = useThemeColor('surface');

  const resolvedTextColor = textColor ?? mutedColor;

  if (!data || data.length === 0) {
    return (
      <View
        testID={testID}
        style={{
          width: radius * 2,
          height: radius * 2,
          borderRadius: radius,
          backgroundColor: `${mutedColor}20`,
        }}
      />
    );
  }

  // Assign default colors if not provided
  const chartData = data.map((item, index) => ({
    ...item,
    color:
      item.color ??
      (index === 0
        ? accentColor
        : `${accentColor}${Math.max(20, 100 - index * 20)}`),
  }));

  return (
    <View testID={testID} style={{ width: radius * 2, height: radius * 2 }}>
      <PieChart
        data={chartData}
        radius={radius}
        innerRadius={innerRadius}
        showText={showText}
        textColor={resolvedTextColor}
        textSize={textSize}
        focusOnPress
        backgroundColor="transparent"
        innerCircleColor={surfaceColor}
      />
    </View>
  );
}
