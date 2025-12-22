import { Stack } from 'expo-router';

export default function SettingsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="child-profile" options={{ presentation: 'modal' }} />
      <Stack.Screen name="app-settings" options={{ presentation: 'modal' }} />
      <Stack.Screen name="log-out" options={{ presentation: 'modal' }} />
      <Stack.Screen name="about" options={{ presentation: 'modal' }} />
    </Stack>
  );
}
