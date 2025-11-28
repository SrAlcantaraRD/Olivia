import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="welcome-1" />
      <Stack.Screen name="welcome-2" />
      <Stack.Screen name="welcome-3" />
      <Stack.Screen name="parent-setup" />
    </Stack>
  );
}
