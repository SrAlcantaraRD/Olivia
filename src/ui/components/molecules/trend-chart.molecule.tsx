// no direct React import required for modern JSX runtime

import { useWindowDimensions, View } from 'react-native';

import { BASE_LOGGER } from '@/domain/core/adapter/logger.adapter';
import { BarChartAtom } from '@/ui/components/atoms/chart.bar.atom';
import { Sparkline } from '@/ui/components/atoms/chart.sparkline.atom';

interface TrendChartProps {
  data: number[];
  variant?: 'line' | 'bar';
  color?: string;
  secondaryColor?: string;
  height?: number;
  normalize?: boolean;
  testID: string;
}

export function TrendChart({
  data,
  variant = 'line',
  color = '#4f46e5',
  secondaryColor,
  height,
  normalize = true,
  testID,
}: TrendChartProps) {
  const { height: windowHeight } = useWindowDimensions();
  const resolvedHeight = Math.floor(windowHeight * 0.4);

  const sanitized: number[] = (data || []).map((v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  });

  // require at least 2 points for line, 1 for bar
  if (variant === 'line' && sanitized.length < 2)
    return <View style={{ height: resolvedHeight }} />;
  if (variant === 'bar' && sanitized.length < 1)
    return <View style={{ height: resolvedHeight }} />;

  const hasMeaningfulData = sanitized.some((v) => v > 0);
  if (!hasMeaningfulData) return <View style={{ height: resolvedHeight }} />;

  let output = sanitized;
  if (normalize) {
    const max = Math.max(...sanitized);
    if (max > 0) {
      output = sanitized.map((v) => Math.round((v / max) * 100));
    }
  }

  BASE_LOGGER.debug({
    component: 'TrendChart',
    variant,
    input: sanitized,
    output,
  });

  if (variant === 'bar') {
    // map to BarChartAtom expected shape: { value: string; count: number }[]
    const values = output.map((v) => ({ value: '', count: v }));
    return (
      <BarChartAtom
        values={values}
        color={color}
        secondaryColor={secondaryColor}
        showAxisLabels={false}
        testID={`${testID}.bar`}
      />
    );
  }

  return <Sparkline data={output} color={color} height={resolvedHeight} />;
}
