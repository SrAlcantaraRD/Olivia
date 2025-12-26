import { Stack } from 'expo-router';

export default function CarerMnagmentLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />

      <Stack.Screen name="create-carer" options={{ presentation: 'modal' }} />

      <Stack.Screen
        name="carer-detail/[carerID]"
        options={{ presentation: 'modal' }}
      />
      <Stack.Screen
        name="carer-detail/[carerID]/delete-carer"
        options={{ presentation: 'modal' }}
      />
      <Stack.Screen
        name="carer-detail/[carerID]/generate-invitation-qr"
        options={{ presentation: 'modal' }}
      />
      <Stack.Screen
        name="carer-detail/[carerID]/synchronization"
        options={{ presentation: 'modal' }}
      />
    </Stack>
  );
}
