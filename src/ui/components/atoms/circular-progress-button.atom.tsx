import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import { Animated, Pressable, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

interface CircularProgressButtonProps {
  onPress: () => void;
  progress: number; // 0 to 1
  size?: number;
  iconName?: keyof typeof Ionicons.glyphMap;
  iconSize?: number;
  backgroundColor: string;
  progressColor: string;
  iconColor?: string;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export function AtomCircularProgressButton({
  onPress,
  progress,
  size = 56,
  iconName = 'chevron-forward',
  iconSize = 24,
  backgroundColor,
  progressColor,
  iconColor = 'white',
}: CircularProgressButtonProps) {
  const animatedProgress = useRef(new Animated.Value(progress)).current;

  useEffect(() => {
    Animated.timing(animatedProgress, {
      toValue: progress,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [progress, animatedProgress]);

  const strokeWidth = 4;
  const gap = 4; // Space between progress border and button
  const innerSize = size - strokeWidth * 2 - gap * 2;
  const radius = size / 2 - strokeWidth / 2;
  const circumference = radius * 2 * Math.PI;

  const strokeDashoffset = animatedProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, 0],
  });

  return (
    <View style={{ width: size, height: size, position: 'relative' }}>
      {/* Progress Circle SVG */}
      <Svg
        width={size}
        height={size}
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        {/* Background circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={progressColor}
          strokeWidth={strokeWidth}
          fill="none"
          opacity={0.3}
        />
        {/* Progress circle */}
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={progressColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>

      {/* Button */}
      <View
        style={{
          position: 'absolute',
          top: strokeWidth + gap,
          left: strokeWidth + gap,
          width: innerSize,
          height: innerSize,
        }}
      >
        <Pressable
          onPress={onPress}
          style={{
            width: innerSize,
            height: innerSize,
            borderRadius: innerSize / 2,
            backgroundColor,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Ionicons name={iconName} size={iconSize} color={iconColor} />
        </Pressable>
      </View>
    </View>
  );
}
