import { Stack } from 'expo-router';
import React from 'react';

export default function ParentSetupLayout() {
  return (
    <Stack>
      <Stack.Screen name="parent-info" />
      <Stack.Screen name="child-info" />
      <Stack.Screen name="modules" />
      <Stack.Screen name="summary" />
    </Stack>
  );
}
