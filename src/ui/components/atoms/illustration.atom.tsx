import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';
import { withUniwind } from 'uniwind';

import type { IconName } from '@/ui/components/atoms/icon.atom';

const StyledIonicons = withUniwind(Ionicons);

interface IllustrationAtomProps {
  /**
   * Primary icon displayed in the center
   */
  icon: IconName;
  /**
   * Size of the main icon (default: 60)
   */
  iconSize?: number;
  /**
   * Shape of the inner container
   */
  shape?: 'rounded-full' | 'rounded-3xl';
  /**
   * Optional secondary icon (e.g., badge or overlay)
   */
  secondaryIcon?: {
    name: IconName;
    size?: number;
    position?: { bottom?: number; right?: number; top?: number; left?: number };
  };
  /**
   * Size variant for the entire illustration
   */
  size?: 'sm' | 'md' | 'lg';
}

const SIZE_CONFIG = {
  sm: {
    outer: 'w-40 h-40',
    inner: 'p-4',
    defaultIconSize: 40,
  },
  md: {
    outer: 'w-52 h-52',
    inner: 'p-6',
    defaultIconSize: 50,
  },
  lg: {
    outer: 'w-64 h-64',
    inner: 'p-8',
    defaultIconSize: 60,
  },
};

/**
 * IllustrationAtom - Consistent illustration component for icons throughout the app
 *
 * Displays an icon within a two-layer circular container with optional secondary icon.
 * Used in onboarding, empty states, and feature highlights.
 *
 * @example
 * ```tsx
 * <IllustrationAtom
 *   icon="heart"
 *   iconSize={80}
 *   shape="rounded-full"
 *   size="lg"
 * />
 *
 * <IllustrationAtom
 *   icon="time-outline"
 *   shape="rounded-3xl"
 *   secondaryIcon={{
 *     name: 'checkmark-done-outline',
 *     size: 40,
 *     position: { bottom: 10, right: 10 }
 *   }}
 * />
 * ```
 */
export function IllustrationAtom({
  icon,
  iconSize,
  shape = 'rounded-full',
  secondaryIcon,
  size = 'lg',
}: IllustrationAtomProps) {
  const config = SIZE_CONFIG[size];
  const finalIconSize = iconSize || config.defaultIconSize;

  return (
    <View
      className={`bg-[#C8CAE5] rounded-full ${config.outer} items-center justify-center`}
      accessibilityRole="image"
      accessibilityLabel="Illustration"
    >
      <View
        className={`bg-[#9B9FC5] ${shape} ${config.inner} items-center justify-center relative`}
      >
        {/* Main Icon */}
        <StyledIonicons
          name={icon}
          size={finalIconSize}
          className="text-[#7B7FA5]"
        />

        {/* Secondary Icon (Badge/Overlay) */}
        {secondaryIcon && (
          <StyledIonicons
            name={secondaryIcon.name}
            size={secondaryIcon.size || 40}
            className="text-[#7B7FA5] absolute"
            style={secondaryIcon.position}
          />
        )}
      </View>
    </View>
  );
}
