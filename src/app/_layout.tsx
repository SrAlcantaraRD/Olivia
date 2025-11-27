import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter';
import { isLiquidGlassAvailable } from 'expo-glass-effect';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { Suspense, useEffect } from 'react';
import { ActivityIndicator, Image, Platform, StyleSheet } from 'react-native';
import { KeyboardProvider } from 'react-native-keyboard-controller';

import { useInitDb } from '@/ddbb';
import '@/ui/i18n/i18n';
import 'react-native-reanimated';
import '../global.css';

import { SQLiteProvider } from 'expo-sqlite';
import { HeroUINativeProvider } from 'heroui-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from 'react-native-reanimated';

import { BASE_LOGGER, DATABASE_NAME } from '@/domain/core';
import { ThemeToggle } from '@/ui/components/atoms/theme-toggle.atom';
import { AppThemeProvider, useAppTheme } from '@/ui/themes/app-theme-context';
import LogoDark from '../assets/logo-dark.png';
import LogoLight from '../assets/logo-light.png';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

SplashScreen.preventAutoHideAsync();

function RootNavigator() {
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
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  const fonts = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const { success, error } = useInitDb();

  BASE_LOGGER.debug('Database initialized', { success, error });

  useEffect(() => {
    BASE_LOGGER.debug('Hiding splash screen');
    SplashScreen.hideAsync();
  }, []);

  if (!fonts) {
    return null;
  }

  return (
    <Suspense fallback={<ActivityIndicator size="large" />}>
      <GestureHandlerRootView style={styles.root}>
        <KeyboardProvider>
          <AppThemeProvider>
            <HeroUINativeProvider
              config={{
                textProps: {
                  allowFontScaling: false,
                },
              }}
            >
              <SQLiteProvider
                databaseName={DATABASE_NAME}
                options={{ enableChangeListener: true }}
                useSuspense
              >
                <RootNavigator />
              </SQLiteProvider>
            </HeroUINativeProvider>
          </AppThemeProvider>
        </KeyboardProvider>
      </GestureHandlerRootView>
    </Suspense>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  logo: {
    width: 80,
    height: 24,
  },
});
