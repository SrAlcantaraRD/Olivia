import { Stack } from 'expo-router';
import { Platform } from 'react-native';

export default function SummaryLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="all-data" />
      <Stack.Screen name="trends" />
      <Stack.Screen name="highlights" />
      <Stack.Screen name="detail/module/[moduleId]" />
      <Stack.Screen name="detail/module/[moduleId]/field/[fieldId]" />
      <Stack.Screen
        name="detail/module/[moduleId]/field/[fieldId]/records"
        options={{
          presentation:
            Platform.OS === 'android' ? 'transparentModal' : 'modal',
          animation: 'fade_from_bottom',
        }}
      />
    </Stack>
  );
}
