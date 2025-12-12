import { Stack } from 'expo-router';

export default function ModalsLayout() {
  return (
    <Stack screenOptions={{ presentation: 'modal' }}>
      <Stack.Screen name="quick-record" options={{ presentation: 'modal' }} />
      <Stack.Screen name="reminders" options={{ presentation: 'modal' }} />
      <Stack.Screen name="symptom-alert" options={{ presentation: 'modal' }} />
      <Stack.Screen name="switch-account" options={{ presentation: 'modal' }} />
      <Stack.Screen
        name="modal-add-carer"
        options={{ presentation: 'modal' }}
      />
      <Stack.Screen
        name="modal-filter-history"
        options={{ presentation: 'modal' }}
      />
    </Stack>
  );
}
