import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from 'heroui-native';
import { View } from 'react-native';
import { withUniwind } from 'uniwind';

const StyledIonicons = withUniwind(Ionicons);

export type IconVariant = 'default' | 'contained' | 'outlined';
export type IconName = keyof typeof Ionicons.glyphMap;

interface IconAtomProps {
  name: IconName;
  variant?: IconVariant;
  iconSize?: number;
  color?: string;
  className?: string;
}

export function IconAtom({
  name,
  variant = 'default',
  iconSize = 24,
  color,
  className,
}: IconAtomProps) {
  // Get theme colors
  const foregroundColor = useThemeColor('accent');
  const backgroundColor = useThemeColor('background');
  const iconColor = color ?? foregroundColor;

  // Default size configuration
  const containerSize = 'w-14 h-14';

  // Default variant - just the icon
  if (variant === 'default') {
    return (
      <StyledIonicons
        name={name}
        size={iconSize}
        style={{ color: iconColor }}
        className={className}
      />
    );
  }

  // Contained variant - icon with background
  if (variant === 'contained') {
    return (
      <View
        style={{ backgroundColor }}
        className={`rounded-2xl items-center justify-center ${containerSize}`}
      >
        <StyledIonicons
          name={name}
          size={iconSize}
          style={{ color: iconColor }}
        />
      </View>
    );
  }

  // Outlined variant - icon with border
  return (
    <View
      className={`rounded-2xl items-center justify-center border-2 ${containerSize}`}
      style={{ borderColor: iconColor }}
    >
      <StyledIonicons
        name={name}
        size={iconSize}
        style={{ color: iconColor }}
      />
    </View>
  );
}
