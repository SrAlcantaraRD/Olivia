import { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';

interface PaginationDotsProps {
  total: number;
  currentIndex: number;
  activeColor: string;
  inactiveColor: string;
  /** Optional array of unique keys for each dot */
  keys?: string[];
}

export function AtomPaginationDots({
  total,
  currentIndex,
  activeColor,
  inactiveColor,
  keys,
}: PaginationDotsProps) {
  return (
    <View className="flex-row items-center justify-center gap-2">
      {Array.from({ length: total }).map((_, index) => (
        <PaginationDot
          key={keys?.[index] ?? `dot-${index}`}
          isActive={index === currentIndex}
          isPassed={index < currentIndex}
          activeColor={activeColor}
          inactiveColor={inactiveColor}
        />
      ))}
    </View>
  );
}

interface PaginationDotProps {
  isActive: boolean;
  isPassed: boolean;
  activeColor: string;
  inactiveColor: string;
}

function PaginationDot({
  isActive,
  isPassed,
  activeColor,
  inactiveColor,
}: PaginationDotProps) {
  const widthAnim = useRef(new Animated.Value(isActive ? 72 : 24)).current;
  const heightAnim = useRef(new Animated.Value(isActive ? 24 : 24)).current;
  const opacityAnim = useRef(new Animated.Value(isActive ? 1 : 0.4)).current;
  const colorAnim = useRef(
    new Animated.Value(isActive || isPassed ? 1 : 0)
  ).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(widthAnim, {
        toValue: isActive ? 84 : 36,
        useNativeDriver: false,
        tension: 50,
        friction: 7,
      }),
      Animated.spring(heightAnim, {
        toValue: 8,
        useNativeDriver: false,
        tension: 50,
        friction: 7,
      }),
      Animated.timing(opacityAnim, {
        toValue: isActive || isPassed ? 1 : 0.4,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(colorAnim, {
        toValue: isActive || isPassed ? 1 : 0,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start();
  }, [isActive, isPassed, widthAnim, heightAnim, opacityAnim, colorAnim]);

  const backgroundColor = colorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [inactiveColor, activeColor],
  });

  return (
    <Animated.View
      style={{
        width: widthAnim,
        height: heightAnim,
        borderRadius: 9999,
        backgroundColor,
        opacity: opacityAnim,
      }}
    />
  );
}
