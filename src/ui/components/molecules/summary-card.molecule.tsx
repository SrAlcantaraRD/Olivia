import type React from 'react';
import { View } from 'react-native';

import type { TTimeBucketItem } from '@/domain/summary/entity/summary-time-bucket.entity';
import { CardAtom } from '@/ui/components/atoms/card.atom';
import {
  TypographyHeading,
  TypographyParagraph,
  TypographySmall,
  TypographyTitle,
} from '@/ui/components/atoms/typography.atom';
import type { Ti18nKeys } from '@/ui/i18n/locales/en-EN';

interface SummaryCardProps {
  chartData: TTimeBucketItem[];
  title: string;
  metricValue: number | string;
  metricLabel?: Ti18nKeys;
  timeValue?: string;
  iconElement?: React.ReactNode;
  chartAverage?: number | null;
  onPress?: () => void;
  testID: string;
  chartComponent: React.ReactNode;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
  chartData,
  title,
  metricValue,
  metricLabel,
  timeValue,
  iconElement,
  onPress,
  testID,
  chartComponent,
}) => (
  <CardAtom className="p-4" onPress={onPress} testID={`${testID}.card`}>
    <View className="flex-row items-center justify-between mb-4">
      <View className="flex-row items-center gap-2">
        {iconElement && (
          <View
            style={{
              width: 32,
              height: 32,
              borderRadius: 12,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {iconElement}
          </View>
        )}
        {title && (
          <TypographyTitle
            testID={`${testID}.title`}
            i18nKey="common.raw-value"
            values={{ value: title }}
            className="font-semibold text-lg"
            variant="default"
          />
        )}
      </View>

      <View className="flex-row items-center gap-2">
        {timeValue && (
          <TypographySmall
            testID={`${testID}.time`}
            i18nKey="common.raw-value"
            values={{ value: timeValue }}
            variant="light"
            className="text-xs"
          />
        )}
      </View>
    </View>

    <View className="flex-row items-end justify-between gap-4">
      <View className="flex-1">
        <View className="flex-row items-end gap-2">
          <TypographyHeading
            testID={`${testID}.metric`}
            i18nKey="common.raw-value"
            values={{ value: metricValue }}
            className="text-4xl"
          />
          {metricLabel && (
            <TypographyParagraph
              testID={`${testID}.metric-label`}
              i18nKey={metricLabel}
              variant="light"
              className="text-base"
            />
          )}
        </View>
      </View>

      <View className="flex-[1.3] items-end justify-center">
        {chartComponent}
      </View>
    </View>
  </CardAtom>
);
