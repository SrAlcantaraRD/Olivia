import { useThemeColor } from 'heroui-native';
import { useEffect } from 'react';
import { Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

interface SelectableCardProps {
  isSelected: boolean;
  onSelect: () => void;
  children: React.ReactNode;
  className?: string;
}

export function SelectableCard({
  isSelected,
  onSelect,
  children,
  className = '',
}: SelectableCardProps) {
  const accentColor = useThemeColor('accent');
  const cardBgColor = useThemeColor('surface');

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

      {children}
    </Pressable>
  );
}
