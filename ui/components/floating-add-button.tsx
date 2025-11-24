import { useRouter } from 'expo-router';
import { Platform, Pressable, StyleSheet } from 'react-native';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/ui/components/ui/icon-symbol';

export function FloatingAddButton() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const tintColor = Colors[colorScheme ?? 'light'].tint;
  const isDark = colorScheme === 'dark';

  return (
    <Pressable
      testID="floating-add-button"
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: tintColor,
          opacity: pressed ? 0.85 : 1,
          transform: [{ scale: pressed ? 0.95 : 1 }],
          shadowColor: isDark ? '#000' : '#000',
        },
      ]}
      onPress={() => router.push('/(tabs)/add')}
    >
      <IconSymbol name="plus" size={36} color="white" weight="bold" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 30 : 25,
    alignSelf: 'center',
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
    zIndex: 1000,
  },
});
