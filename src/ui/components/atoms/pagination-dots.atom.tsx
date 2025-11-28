import { useEffect, useRef, useState } from 'react';
import { Animated, View } from 'react-native';

interface PaginationDotsProps {
  total: number;
  currentIndex: number;
  activeColor: string;
  inactiveColor: string;
  /** Optional array of unique keys for each dot */
  keys?: string[];
  /** Maximum width available for all dots */
  maxWidth?: number;
}

export function AtomPaginationDots({
  total,
  currentIndex,
  activeColor,
  inactiveColor,
  keys,
  maxWidth,
}: PaginationDotsProps) {
  const [containerWidth, setContainerWidth] = useState<number | undefined>(
    maxWidth
  );

  // Calcular tamaños basados en el ancho disponible
  // Proporción: activo es 3x más ancho que inactivo (antes era 84px vs 36px ≈ 2.33x, redondeamos a 3x)
  // Gap entre dots: 8px (gap-2)
  const calculateDotSizes = () => {
    const width = containerWidth || maxWidth;
    if (!width) {
      return { activeWidth: 84, inactiveWidth: 36 };
    }

    const gapSize = 8;
    const totalGaps = (total - 1) * gapSize;
    const availableWidth = width - totalGaps; // Si tenemos n dots, uno activo (3 unidades) y (n-1) inactivos (1 unidad cada uno)
    // Total unidades = 3 + (n-1) = n + 2
    const totalUnits = total + 2;
    const unitWidth = availableWidth / totalUnits;

    return {
      activeWidth: unitWidth * 3,
      inactiveWidth: unitWidth,
    };
  };

  const { activeWidth, inactiveWidth } = calculateDotSizes();

  return (
    <View
      className="flex-row items-center justify-center gap-2"
      onLayout={(event) => {
        if (!maxWidth) {
          setContainerWidth(event.nativeEvent.layout.width);
        }
      }}
    >
      {Array.from({ length: total }).map((_, index) => (
        <PaginationDot
          key={keys?.[index] ?? `dot-${index}`}
          isActive={index === currentIndex}
          isPassed={index < currentIndex}
          activeColor={activeColor}
          inactiveColor={inactiveColor}
          activeWidth={activeWidth}
          inactiveWidth={inactiveWidth}
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
  activeWidth: number;
  inactiveWidth: number;
}

function PaginationDot({
  isActive,
  isPassed,
  activeColor,
  inactiveColor,
  activeWidth,
  inactiveWidth,
}: PaginationDotProps) {
  const widthAnim = useRef(
    new Animated.Value(isActive ? activeWidth : inactiveWidth)
  ).current;
  const heightAnim = useRef(new Animated.Value(8)).current;
  const opacityAnim = useRef(new Animated.Value(isActive ? 1 : 0.4)).current;
  const colorAnim = useRef(
    new Animated.Value(isActive || isPassed ? 1 : 0)
  ).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(widthAnim, {
        toValue: isActive ? activeWidth : inactiveWidth,
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
  }, [
    isActive,
    isPassed,
    widthAnim,
    heightAnim,
    opacityAnim,
    colorAnim,
    activeWidth,
    inactiveWidth,
  ]);

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
