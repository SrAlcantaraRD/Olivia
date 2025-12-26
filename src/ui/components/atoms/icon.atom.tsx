import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from 'heroui-native';
import { View } from 'react-native';
import { withUniwind } from 'uniwind';

import { cn } from '@/ui/lib/utils';

const StyledIonicons = withUniwind(Ionicons);

export type IconVariant = 'default' | 'danger';
export type IconName = keyof typeof Ionicons.glyphMap;

interface IconAtomProps {
  name: IconName;
  variant?: IconVariant;
  iconSize?: number;
}

export function IconAtom({
  name,
  variant = 'default',
  iconSize = 24,
}: IconAtomProps) {
  // Get theme colors
  const foregroundColor = useThemeColor('accent');
  const dangerColor = useThemeColor('danger');
  const iconColor = variant === 'danger' ? dangerColor : foregroundColor;

  return (
    <View className={cn('items-center justify-center p-1')}>
      <StyledIonicons
        name={name}
        size={iconSize}
        style={{ color: iconColor }}
      />
    </View>
  );
}
