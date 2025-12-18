import { Ionicons } from '@expo/vector-icons';
import { isLiquidGlassAvailable } from 'expo-glass-effect';
import type { FC } from 'react';
import { Pressable } from 'react-native';
import Animated, { FadeOut, ZoomIn } from 'react-native-reanimated';
import { withUniwind } from 'uniwind';

import { useAdapters } from '@/adapter';
import { useAppSettings } from '@/domain/core/hook/use-app-settings.hook';
import { cn } from '@/ui/lib/utils';

const StyledIonicons = withUniwind(Ionicons);

export const ThemeToggle: FC = () => {
  const { cacheAdapter, loggerAdapter } = useAdapters();
  const { toggleTheme, isLight } = useAppSettings({
    loggerAdapter,
    cacheAdapter,
  });

  const isLGAvailable = isLiquidGlassAvailable();

  return (
    <Pressable
      testID="button.toggle-theme"
      onPress={toggleTheme}
      className={cn('p-3', isLGAvailable && 'px-2.5 py-0')}
    >
      {isLight ? (
        <Animated.View key="moon" entering={ZoomIn} exiting={FadeOut}>
          <StyledIonicons name="moon" size={20} className="text-black" />
        </Animated.View>
      ) : (
        <Animated.View key="sun" entering={ZoomIn} exiting={FadeOut}>
          <StyledIonicons name="sunny" size={20} className="text-white" />
        </Animated.View>
      )}
    </Pressable>
  );
};
