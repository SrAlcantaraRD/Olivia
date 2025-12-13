import { useThemeColor } from 'heroui-native';
import { useEffect } from 'react';
import { Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { CardAtom } from '@/ui/components/atoms/card.atom';

interface SelectableCardProps {
  isSelected: boolean;
  onPress: () => void;
  children: React.ReactNode;
  className?: string;
  testID: string;
}

export function SelectableCard({
  isSelected,
  onPress,
  children,
  className = '',
  testID,
}: SelectableCardProps) {
  const accentColor = useThemeColor('accent');

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
      onPress={onPress}
      // className={`rounded-3xl relative ${className} shadow-primary-500/30`}
      className={`rounded-3xl relative ${className} shadow-[0px_1px_20px_-1px_rgb(0,139,194)]`}
      testID={`${testID}.pressable`}
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

      <CardAtom variant="transparent">{children}</CardAtom>
    </Pressable>
  );
}
