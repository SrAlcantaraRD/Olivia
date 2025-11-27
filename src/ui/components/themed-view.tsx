import { useThemeColor } from 'heroui-native';
import { View, type ViewProps } from 'react-native';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({
  style,
  lightColor,
  darkColor,
  ...otherProps
}: ThemedViewProps) {
  const backgroundColor = useThemeColor('background');

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
