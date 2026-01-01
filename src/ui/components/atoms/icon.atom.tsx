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
  emptyBackground?: boolean;
}

export function IconAtom({
  name,
  variant = 'default',
  iconSize = 24,
  emptyBackground = false,
}: IconAtomProps) {
  // Get theme colors
  const foregroundColor = useThemeColor('accent');
  const dangerColor = useThemeColor('danger');
  const iconColor = variant === 'danger' ? dangerColor : foregroundColor;
  const contentColor = variant === 'danger' ? 'bg-danger/30' : 'bg-accent/30';

  return (
    <View
      className={cn(
        'items-center justify-center p-2 rounded-lg',
        // `bg-[${useThemeColor('danger-foreground')}]`,
        emptyBackground ? undefined : contentColor
      )}
    >
      <StyledIonicons
        name={name}
        size={iconSize}
        style={{ color: iconColor }}
      />
    </View>
  );
}
