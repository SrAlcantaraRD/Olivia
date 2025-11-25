import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Suspense } from 'react';
import { ActivityIndicator } from 'react-native';

import { useInitDb } from '@/ddbb';
import { useColorScheme } from '@/hooks/use-color-scheme';
import '@/ui/i18n/i18n';
import 'react-native-reanimated';
import '../global.css';

import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { SQLiteProvider } from 'expo-sqlite';
import { HeroUINativeProvider } from 'heroui-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { BASE_LOGGER, DATABASE_NAME } from '@/domain/core';
import { FloatingAddButton } from '@/ui/components/floating-add-button';
import '@/ui/i18n/i18n';
import 'react-native-reanimated';
import '../global.css';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const { success, error } = useInitDb();
  BASE_LOGGER.debug('Database initialized', { success, error });
  const colorScheme = useColorScheme();

  return (
    <Suspense fallback={<ActivityIndicator size="large" />}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <HeroUINativeProvider>
          <SQLiteProvider
            databaseName={DATABASE_NAME}
            options={{ enableChangeListener: true }}
            useSuspense
          >
            <ThemeProvider
              value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
            >
              <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen
                  name="modal"
                  options={{ presentation: 'modal', title: 'Modal' }}
                />
              </Stack>
              <FloatingAddButton />
              <StatusBar style="auto" />
            </ThemeProvider>
          </SQLiteProvider>
        </HeroUINativeProvider>
      </GestureHandlerRootView>
    </Suspense>
  );
}
