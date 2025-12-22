import { useThemeColor } from 'heroui-native';
import { useEffect } from 'react';
import { Pressable, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

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
  const backgroundColor = useThemeColor('accent-soft');

  const borderOpacity = useSharedValue(isSelected ? 1 : 0);
  const borderWidth = useSharedValue(isSelected ? 2 : 0);

  useEffect(() => {
    borderOpacity.value = withTiming(isSelected ? 1 : 0, { duration: 600 });
    if (isSelected) {
      borderWidth.value = withSequence(
        withTiming(4, { duration: 300 }),
        withTiming(2, { duration: 300 })
      );
    } else {
      borderWidth.value = withSequence(
        withTiming(4, { duration: 300 }),
        withTiming(0, { duration: 300 })
      );
    }
  }, [isSelected, borderOpacity]);

  const animatedBorderStyle = useAnimatedStyle(() => {
    return {
      borderColor: accentColor,
      opacity: borderOpacity.value,
      borderWidth: borderWidth.value,
    };
  });

  return (
    <Pressable
      onPress={onPress}
      className={`rounded-lg relative ${className} `}
      testID={`${testID}.pressable`}
      style={{ backgroundColor }}
    >
      <Animated.View
        style={animatedBorderStyle}
        className="absolute inset-0 rounded-lg"
      />

      <View className="p-4 rounded-lg">{children}</View>
    </Pressable>
  );
}
