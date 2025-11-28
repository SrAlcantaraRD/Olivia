import { Ionicons } from '@expo/vector-icons';
import { useEffect } from 'react';
import { Pressable, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

interface SelectableCardProps {
  isSelected: boolean;
  onSelect: () => void;
  accentColor: string;
  mutedColor: string;
  cardBgColor: string;
  children: React.ReactNode;
  className?: string;
  flex?: boolean;
  showIndicator?: boolean;
  indicatorPosition?: 'top-right' | 'top-left' | 'none';
  indicatorShape?: 'rounded-full' | 'rounded';
}

export function SelectableCard({
  isSelected,
  onSelect,
  accentColor,
  mutedColor,
  cardBgColor,
  children,
  className = '',
  flex = false,
  showIndicator = true,
  indicatorPosition = 'top-right',
  indicatorShape = 'rounded-full',
}: SelectableCardProps) {
  // Animated value for border opacity
  const borderOpacity = useSharedValue(isSelected ? 1 : 0);

  useEffect(() => {
    borderOpacity.value = withTiming(isSelected ? 1 : 0, { duration: 300 });
  }, [isSelected, borderOpacity]);

  const animatedBorderStyle = useAnimatedStyle(() => {
    return {
      borderColor: accentColor,
      opacity: borderOpacity.value,
    };
  });

  return (
    <Pressable
      onPress={onSelect}
      style={{
        backgroundColor: cardBgColor,
        flex: flex ? 1 : undefined,
      }}
      className={`rounded-3xl relative ${className}`}
    >
      {/* Animated border */}
      <Animated.View
        style={[
          {
            borderWidth: 2,
            borderColor: accentColor,
          },
          animatedBorderStyle,
        ]}
        className="absolute inset-0 rounded-3xl"
      />

      {/* Content */}
      {children}

      {/* Selection indicator */}
      {showIndicator && indicatorPosition !== 'none' && (
        <View
          style={{
            borderWidth: 2,
            borderColor: isSelected ? accentColor : mutedColor,
            backgroundColor: isSelected ? accentColor : 'transparent',
          }}
          className={`absolute w-6 h-6 ${indicatorShape} items-center justify-center ${
            indicatorPosition === 'top-right' ? 'top-4 right-4' : 'top-4 left-4'
          }`}
        >
          {isSelected && <Ionicons name="checkmark" size={16} color="white" />}
        </View>
      )}
    </Pressable>
  );
}
