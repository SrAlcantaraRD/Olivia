import { useThemeColor } from 'heroui-native';
import { Pressable, View } from 'react-native';

import { BASE_LOGGER } from '@/domain/core/adapter/logger.adapter';
import type { TModule } from '@/domain/module/entity/module.entity';
import type { MODULE_KEY_ENUM } from '@/domain/module/enum/module-key.enum';
import { CardAtom } from '@/ui/components/atoms/card.atom';
import { IconAtom, type IconName } from '@/ui/components/atoms/icon.atom';
import {
  TypographySmall,
  TypographyTitle,
} from '@/ui/components/atoms/typography.atom';
import { TrendChart } from '@/ui/components/molecules/trend-chart.molecule';
import type { Ti18nKeys } from '@/ui/i18n/locales/en-EN';

interface StatCardWithTrendProps {
  module: TModule;
  value: number | string;
  data?: number[];
  onPress?: () => void;
  chartVariant?: 'line' | 'bar';
}

export function StatCardWithTrend({
  module,
  value,
  data = [],
  onPress,
  chartVariant = 'line',
}: StatCardWithTrendProps) {
  const MODULE_META_BY_KEY: Partial<
    Record<
      MODULE_KEY_ENUM,
      { icon: IconName; colorKey: Parameters<typeof useThemeColor>[0] }
    >
  > = {
    URINE: { icon: 'water', colorKey: 'accent' },
    STOOL: { icon: 'nutrition', colorKey: 'accent' },
    MEDICATION: { icon: 'medical', colorKey: 'accent' },
  };

  const meta = MODULE_META_BY_KEY[module.code];
  const colorKey: Parameters<typeof useThemeColor>[0] =
    meta?.colorKey ?? 'accent';
  const chipColor = useThemeColor(colorKey);

  const titleKey = (module.code
    ? `component.stat_card.${String(module.code).toLowerCase()}_label`
    : (module.name ?? '')) as unknown as Ti18nKeys;

  const iconName = meta?.icon;

  // log at debug level to avoid spamming error logs in production
  BASE_LOGGER.debug({ data });

  // sanitize incoming series and compute whether there's meaningful data
  const sanitizedSeries: number[] = (data || []).map((v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  });

  const hasMeaningfulData = sanitizedSeries.some((v) => v > 0);

  // normalization moved to `TrendChart` to keep responsibilities separated

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={titleKey}
    >
      <CardAtom>
        <View className="flex-row justify-between items-center mb-2">
          <View className="flex-row items-center gap-3">
            {iconName && (
              <View
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 12,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: chipColor,
                }}
              >
                <IconAtom name={iconName} />
              </View>
            )}
            <TypographySmall
              i18nKey={titleKey}
              className="font-medium"
              testID={`screen.stat-card.${String(titleKey)}`}
            />
          </View>
        </View>
        <View className="gap-2">
          <TypographyTitle
            i18nKey="common.raw-value"
            className="text-default-400"
            testID={`screen.stat-card.${String(titleKey)}.total_label`}
            values={{ value: value }}
          />
          {hasMeaningfulData ? (
            <TrendChart
              data={sanitizedSeries}
              height={chartVariant === 'bar' ? undefined : 36}
              color={chipColor}
              variant={chartVariant}
              testID={`screen.stat-card.${String(titleKey)}.trend-chart`}
            />
          ) : (
            <TypographySmall
              i18nKey="page.report.no-history"
              testID={`screen.stat-card.${String(titleKey)}.no-trend-data`}
              variant="light"
              className="text-center"
            />
          )}
        </View>
      </CardAtom>
    </Pressable>
  );
}
