import { Stack } from 'expo-router';
import { Platform } from 'react-native';

export default function CarerMnagmentLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        presentation: Platform.OS === 'android' ? 'transparentModal' : 'modal',
        animation: 'fade_from_bottom',
      }}
    >
      <Stack.Screen name="index" options={{ presentation: 'card' }} />

      <Stack.Screen name="create-carer" />

      <Stack.Screen name="carer-detail/[carerID]" />
      <Stack.Screen name="carer-detail/[carerID]/delete-carer" />
      <Stack.Screen name="carer-detail/[carerID]/generate-invitation-qr" />
      <Stack.Screen name="carer-detail/[carerID]/synchronization" />
    </Stack>
  );
}
