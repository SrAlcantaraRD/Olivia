import { useThemeColor } from 'heroui-native';
import { Pressable, Text, View } from 'react-native';

import { CardAtom } from '@/ui/components/atoms/card.atom';
import { IconAtom, type IconName } from '@/ui/components/atoms/icon.atom';
import { Sparkline } from '@/ui/components/atoms/sparkline.atom';
import { TypographySmall } from '@/ui/components/atoms/typography.atom';
import type { Ti18nKeys } from '@/ui/i18n/locales/en-EN';

interface StatCardWithTrendProps {
  titleKey: Ti18nKeys;
  value: number | string;
  data: number[];
  color?: string;
  iconName?: IconName;
  onPress?: () => void;
}

export function StatCardWithTrend({
  titleKey,
  value,
  data,
  color,
  iconName,
  onPress,
}: StatCardWithTrendProps) {
  const fg = useThemeColor('foreground');

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={titleKey}
    >
      <CardAtom className="p-4">
        <View className="flex-row justify-between items-center mb-2">
          <View className="flex-row items-center gap-2">
            {iconName && <IconAtom name={iconName} />}
            <TypographySmall i18nKey={titleKey} className="font-medium" />
          </View>
        </View>
        <View className="mb-2">
          <View>
            <Text style={{ color: fg }} className="text-3xl font-bold">
              {value}
            </Text>
          </View>
          <View className="mt-2">
            <Sparkline data={data} height={36} color={color} />
          </View>
        </View>
      </CardAtom>
    </Pressable>
  );
}
