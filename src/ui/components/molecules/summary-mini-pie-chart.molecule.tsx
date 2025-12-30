import type React from 'react';
import { View } from 'react-native';

import type { TTimeBucketItem } from '@/domain/summary/entity/summary-time-bucket.entity';
import { PieChartAtom } from '@/ui/components/atoms/chart.pie.atom';

interface SummaryMiniPieChartProps {
  data: TTimeBucketItem[];
  size?: number;
  testID: string;
}

export const SummaryMiniPieChart: React.FC<SummaryMiniPieChartProps> = ({
  data,
  size = 64,
  testID,
}) => {
  const radius = size / 2;
  const innerRadius = radius * 0.6;

  const chartData = data.map((item) => ({
    value: item.value,
    label: item.label,
  }));

  return (
    <View className="items-center justify-center" testID={testID}>
      <PieChartAtom
        data={chartData}
        radius={radius}
        innerRadius={innerRadius}
        testID={`${testID}.pie`}
      />
    </View>
  );
};
