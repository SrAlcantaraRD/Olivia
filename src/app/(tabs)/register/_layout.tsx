import { Stack } from 'expo-router';
import { Platform } from 'react-native';

export default function RegisterLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen
        name="execute-register"
        options={{
          presentation:
            Platform.OS === 'android' ? 'transparentModal' : 'modal',
          animation: 'fade_from_bottom',
        }}
      />
    </Stack>
  );
}
