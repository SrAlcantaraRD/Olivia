import { useThemeColor } from 'heroui-native';
import { Pressable, Text, View } from 'react-native';

import type { TModule } from '@/domain/module/entity/module.entity';
import type { MODULE_KEY_ENUM } from '@/domain/module/enum/module-key.enum';
import { CardAtom } from '@/ui/components/atoms/card.atom';
import { IconAtom, type IconName } from '@/ui/components/atoms/icon.atom';
import { Sparkline } from '@/ui/components/atoms/sparkline.atom';
import { TypographySmall } from '@/ui/components/atoms/typography.atom';
import type { Ti18nKeys } from '@/ui/i18n/locales/en-EN';

interface StatCardWithTrendProps {
  module: TModule;
  value: number | string;
  data?: number[];
  onPress?: () => void;
}

export function StatCardWithTrend({
  module,
  value,
  data = [],
  onPress,
}: StatCardWithTrendProps) {
  const fg = useThemeColor('foreground');

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
          <View>
            <IconAtom name="chevron-forward" className="text-default-300" />
          </View>
        </View>
        <View className="mb-2">
          <View>
            <Text style={{ color: fg }} className="text-3xl font-bold">
              {value}
            </Text>
          </View>
          <View className="mt-2">
            <Sparkline data={data} height={36} color={chipColor} />
          </View>
        </View>
      </CardAtom>
    </Pressable>
  );
}
