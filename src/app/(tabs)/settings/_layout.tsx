import { Stack } from 'expo-router';
import { Platform } from 'react-native';

export default function SettingsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        presentation: Platform.OS === 'android' ? 'transparentModal' : 'modal',
        animation: 'fade_from_bottom',
      }}
    >
      <Stack.Screen name="index" options={{ presentation: 'card' }} />
      <Stack.Screen name="child-profile" />
      <Stack.Screen name="app-settings" />
      <Stack.Screen name="log-out" />
      <Stack.Screen name="about" />
      <Stack.Screen name="synchronize-records" />
    </Stack>
  );
}
