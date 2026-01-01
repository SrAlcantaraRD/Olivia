import { Card, PressableFeedback, useThemeColor } from 'heroui-native';
import type React from 'react';
import { useEffect } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { cn } from '@/ui/lib/utils';
import { useAppTheme } from '@/ui/themes/app-theme-context';

type CardAtomProps = React.ComponentProps<typeof Card> & {
  onPress?: () => void;
  isSelectable?: boolean;
  isSelected?: boolean;
  testID: string;
};

export const CardAtom = ({
  children,
  className,
  onPress,
  isSelectable = false,
  isSelected = false,
  testID,
  ...props
}: CardAtomProps) => {
  const handlerOnPress = () => {
    setTimeout(
      () => {
        onPress?.();
      },
      isSelectable ? 0 : 300
    );
  };

  const { isLight } = useAppTheme();
  const accentSoftColor = useThemeColor('accent-soft');
  const accentColor = useThemeColor('accent');

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
    <PressableFeedback
      feedbackVariant="ripple"
      className="rounded-lg relative shadow-2xs/10"
      onPress={handlerOnPress}
      animation={{
        ripple: {
          backgroundColor: { value: isLight ? accentColor : accentSoftColor },
          opacity: { value: [0, 0.4, 0] },
          progress: { baseDuration: 600 },
        },
      }}
      testID={`${testID}.pressable`}
    >
      <Card
        {...props}
        testID={`${testID}.card`}
        className={cn('rounded-lg', 'light:bg-white', className)}
      >
        {children}
      </Card>

      {isSelectable && (
        <Animated.View
          pointerEvents="none"
          style={animatedBorderStyle}
          className="absolute inset-0 rounded-lg"
          testID={`${testID}.selection-border`}
        />
      )}
    </PressableFeedback>
  );
};
