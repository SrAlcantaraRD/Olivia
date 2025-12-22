import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="parent-setup" />
      <Stack.Screen name="secondary-carer-setup" />
    </Stack>
  );
}
