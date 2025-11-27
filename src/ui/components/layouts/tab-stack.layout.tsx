import { isLiquidGlassAvailable } from 'expo-glass-effect';
import { Stack } from 'expo-router';
import { Image, Platform, StyleSheet } from 'react-native';

import LogoDark from '@/assets/logo-dark.png';
import LogoLight from '@/assets/logo-light.png';
import { ThemeToggle } from '@/ui/components/atoms/theme-toggle.atom';
import { useAppTheme } from '@/ui/themes/app-theme-context';

interface TabStackProps {
  children?: React.ReactNode;
}

export function TabStack({ children }: TabStackProps) {
  const { isDark } = useAppTheme();

  const renderTitle = () => {
    return (
      <Image
        source={isDark ? LogoLight : LogoDark}
        style={styles.logo}
        resizeMode="contain"
      />
    );
  };

  const renderThemeToggle = () => <ThemeToggle />;

  return (
    <Stack
      screenOptions={{
        headerTitleAlign: 'center',
        headerTransparent: true,
        headerBlurEffect: isDark ? 'dark' : 'light',
        headerTintColor: isDark ? '#FFFFFF' : '#000000',
        headerStyle: {
          backgroundColor: Platform.select({
            ios: undefined,
            android: isDark ? '#000000' : '#FFFFFF',
          }),
        },
        headerTitleStyle: {
          fontFamily: 'Inter_600SemiBold',
        },
        headerRight: renderThemeToggle,
        headerTitle: renderTitle,
        headerBackButtonDisplayMode: 'generic',
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        fullScreenGestureEnabled: isLiquidGlassAvailable(),
        contentStyle: {
          backgroundColor: isDark ? '#000000' : '#FFFFFF',
        },
      }}
    >
      {children}
    </Stack>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 80,
    height: 24,
  },
});
