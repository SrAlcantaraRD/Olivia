import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from 'heroui-native';
import { View } from 'react-native';
import { withUniwind } from 'uniwind';

const StyledIonicons = withUniwind(Ionicons);

export type IconVariant = 'default' | 'contained' | 'outlined';

interface IconAtomProps {
  /**
   * Icon name from Ionicons
   */
  name: keyof typeof Ionicons.glyphMap;
  /**
   * Visual variant
   */
  variant?: IconVariant;
}

/**
 * IconAtom - Consistent icon component for the entire app
 *
 * Provides three variants:
 * - default: Icon only, no container
 * - contained: Icon with colored background container
 * - outlined: Icon with border container
 *
 * Uses `useThemeColor` from heroui-native for theme-aware colors.
 *
 * @example
 * ```tsx
 * // Default icon
 * <IconAtom name="water" />
 *
 * // Contained with background
 * <IconAtom name="water" variant="contained" />
 *
 * // Outlined
 * <IconAtom name="settings" variant="outlined" />
 * ```
 */
export function IconAtom({ name, variant = 'default' }: IconAtomProps) {
  // Get theme colors
  const foregroundColor = useThemeColor('accent');
  const backgroundColor = useThemeColor('background');

  // Default size configuration
  const iconSize = 28;
  const containerSize = 'w-14 h-14';

  // Default variant - just the icon
  if (variant === 'default') {
    return (
      <StyledIonicons
        name={name}
        size={iconSize}
        style={{ color: foregroundColor }}
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
          style={{ color: foregroundColor }}
        />
      </View>
    );
  }

  // Outlined variant - icon with border
  return (
    <View
      className={`rounded-2xl items-center justify-center border-2 ${containerSize}`}
      style={{ borderColor: foregroundColor }}
    >
      <StyledIonicons
        name={name}
        size={iconSize}
        style={{ color: foregroundColor }}
      />
    </View>
  );
}
