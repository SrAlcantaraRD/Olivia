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
      <Stack.Screen name="carer-managment/index" />

      <Stack.Screen name="carer-managment/carer-detail/[carerID]" />
      <Stack.Screen
        name="carer-managment/carer-detail/[carerID]/generate-invitation-qr"
        options={{ presentation: 'modal' }}
      />
      <Stack.Screen
        name="carer-managment/carer-detail/[carerID]/synchronization"
        options={{ presentation: 'modal' }}
      />
      <Stack.Screen name="app-settings" options={{ presentation: 'modal' }} />
      <Stack.Screen name="log-out" options={{ presentation: 'modal' }} />
      <Stack.Screen name="about" options={{ presentation: 'modal' }} />
    </Stack>
  );
}
