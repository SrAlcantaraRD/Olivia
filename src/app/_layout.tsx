import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter';
import { isLiquidGlassAvailable } from 'expo-glass-effect';
import * as SplashScreen from 'expo-splash-screen';
import { Suspense, useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import { ActivityIndicator, Image, Platform, StyleSheet } from 'react-native';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import Toast, { type ToastConfig } from 'react-native-toast-message';

import i18n from '@/ui/i18n/i18n';
import 'react-native-reanimated';
import '../global.css';

import { useDrizzleStudio } from 'expo-drizzle-studio-plugin';
import { Stack } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import { HeroUINativeProvider } from 'heroui-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from 'react-native-reanimated';

import { SQLITE_DB } from '@/database/config/database.config';
import { useInitDb } from '@/database/execute-migrations';
import { BASE_LOGGER } from '@/domain/core/adapter/logger.adapter';
import { ENVIRONMENT_VARIABLES } from '@/domain/core/constant/environment-variables.constants';
import { ThemeToggle } from '@/ui/components/atoms/theme-toggle.atom';
import { toastConfig } from '@/ui/components/particles/toast-design.particle';
import { SettingsProvider } from '@/ui/context/settings.context';
import { AppThemeProvider, useAppTheme } from '@/ui/themes/app-theme-context';
import LogoDark from '../assets/logo-dark.png';
import LogoLight from '../assets/logo-light.png';

export const unstable_settings = {
  initialRouteName: '(tabs)/register',
};

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

SplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const { isDark } = useAppTheme();

  // Enable Drizzle Studio for development
  useDrizzleStudio(SQLITE_DB);

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
        headerShown: false,
        headerTitleAlign: 'center',
        headerTransparent: false,
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
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(onboarding)" />
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
      <SQLiteProvider
        databaseName={ENVIRONMENT_VARIABLES.DATABASE_NAME}
        options={{ enableChangeListener: true }}
        useSuspense
      >
        <GestureHandlerRootView style={styles.root}>
          <KeyboardProvider>
            <AppThemeProvider>
              <SettingsProvider>
                <HeroUINativeProvider
                  config={{
                    textProps: {
                      allowFontScaling: false,
                    },
                  }}
                >
                  <I18nextProvider i18n={i18n}>
                    <RootNavigator />
                    <Toast config={toastConfig as ToastConfig} />
                  </I18nextProvider>
                </HeroUINativeProvider>
              </SettingsProvider>
            </AppThemeProvider>
          </KeyboardProvider>
        </GestureHandlerRootView>
      </SQLiteProvider>
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
