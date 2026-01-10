import { Stack } from 'expo-router';

export default function SummaryLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="detail/module/[moduleId]" />
      <Stack.Screen name="detail/module/[moduleId]/field/[fieldId]" />
    </Stack>
  );
}
