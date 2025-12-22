// no direct React import required for modern JSX runtime

import { useWindowDimensions, View } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';

interface BarChartProps {
  values: { value: string; count: number }[];
  height?: number;
  width?: number;
  color?: string;
  secondaryColor?: string;
  barColors?: string[];
  showLine?: boolean;
  showAxisLabels?: boolean;
  testID: string;
}

export function BarChartAtom({
  values,
  height,
  width,
  color = '#4f46e5',
  secondaryColor,
  barColors,
  showLine = false,
  showAxisLabels = true,
  testID,
}: BarChartProps) {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const resolvedHeight =
    typeof height === 'number' ? height : Math.floor(windowHeight * 0.2);

  if (!values || values.length === 0)
    return <View style={{ height: resolvedHeight }} />;

  const maxWidth = Math.max(240, windowWidth - 20 - 20 - 48);
  const chartWidth =
    typeof width === 'number' ? Math.min(width, maxWidth) : maxWidth;

  // For distribution charts we cap to top 20 (readability).
  // For compact trend charts we prefer the MOST RECENT values that fit on screen.
  // When showing axis labels, allow more bars but ensure labels fit
  const isCompact = showAxisLabels === false;
  const availableForBars = Math.max(1, chartWidth - 20);
  const minWidthPerLabel = showAxisLabels ? 35 : 5; // More space needed for labels
  const maxBarsByWidth = Math.max(
    1,
    Math.floor(availableForBars / minWidthPerLabel)
  );
  const maxItems = isCompact
    ? Math.min(values.length, maxBarsByWidth)
    : Math.min(values.length, maxBarsByWidth);
  const sliced = isCompact
    ? values.slice(-maxItems)
    : values.slice(0, maxItems);

  const sanitized = sliced.map((v) => {
    const n = Number(v.count);
    return { label: v.value, value: Number.isFinite(n) ? n : 0 };
  });

  const alt = secondaryColor ?? color;
  const data = sanitized.map((v, index) => ({
    value: v.value,
    label: v.label,
    frontColor: barColors?.[index] ?? (index % 2 === 0 ? color : alt),
    gradientColor: barColors?.[index] ?? (index % 2 === 0 ? color : alt),
  }));

  // Fit bars into available width to avoid horizontal scroll hiding recent bars.
  const count = Math.max(1, data.length);
  const unit = availableForBars / count;
  const barWidth = Math.max(3, Math.min(16, Math.floor(unit * 0.55)));
  const spacing = Math.max(2, Math.min(14, Math.floor(unit * 0.25)));

  const rawMax = Math.max(...sanitized.map((v) => v.value), 1);
  const roundUpNice = (n: number) => {
    if (n <= 1) return 1;
    const pow = 10 ** Math.floor(Math.log10(n));
    return Math.ceil(n / pow) * pow;
  };
  const maxValue = roundUpNice(rawMax);
  const noOfSections = 4;
  const stepValue = Math.ceil(maxValue / noOfSections);

  const yAxisLabelTexts = showAxisLabels
    ? Array.from({ length: noOfSections + 1 }, (_, i) => {
        const value = i * stepValue;
        if (value >= 1000) return `${Math.round(value / 1000)}k`;
        return String(value);
      })
    : undefined;

  return (
    <View
      style={{ height: resolvedHeight }}
      testID={`${testID}.bar-chart.atom`}
    >
      <BarChart
        data={data}
        height={resolvedHeight}
        width={windowWidth}
        barWidth={(barWidth / values.length) * 10}
        initialSpacing={10}
        spacing={spacing}
        barBorderRadius={4}
        showGradient
        yAxisThickness={0}
        xAxisType={'dashed'}
        xAxisColor={showAxisLabels ? color : 'transparent'}
        xAxisThickness={showAxisLabels ? 1 : 0}
        yAxisTextStyle={{ color: showAxisLabels ? color : 'transparent' }}
        stepValue={stepValue}
        maxValue={maxValue}
        noOfSections={noOfSections}
        rulesColor={showAxisLabels ? color : 'transparent'}
        rulesThickness={showAxisLabels ? 1 : 0}
        yAxisLabelTexts={yAxisLabelTexts}
        xAxisLabelTexts={showAxisLabels ? data.map((d) => d.label) : undefined}
        labelWidth={showAxisLabels ? 40 : 0}
        xAxisLabelTextStyle={{
          color: showAxisLabels ? color : 'transparent',
          textAlign: 'center',
          fontSize: 10,
        }}
        showLine={showLine}
        lineConfig={{
          color: alt,
          thickness: 3,
          curved: true,
          hideDataPoints: true,
          shiftY: 0,
          initialSpacing: -30,
        }}
      />
    </View>
  );
}
