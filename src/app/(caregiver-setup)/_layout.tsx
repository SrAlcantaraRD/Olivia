import { Stack } from 'expo-router';
import React from 'react';

export default function CaregiverSetupLayout() {
  return (
    <Stack>
      <Stack.Screen name="scan-qr" />
      <Stack.Screen name="confirm-link" />
    </Stack>
  );
}
