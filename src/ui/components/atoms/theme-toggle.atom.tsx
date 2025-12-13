import { Ionicons } from '@expo/vector-icons';
import { isLiquidGlassAvailable } from 'expo-glass-effect';
import * as Haptics from 'expo-haptics';
import type { FC } from 'react';
import { Platform, Pressable } from 'react-native';
import Animated, { FadeOut, ZoomIn } from 'react-native-reanimated';
import { withUniwind } from 'uniwind';

import { useAdapters } from '@/adapter';
import { BASE_LOGGER } from '@/domain/core/adapter/logger.adapter';
import { EThemeMode } from '@/domain/core/enum/settings.enum';
import { SetAppThemeUseCase } from '@/domain/core/use-case/set-app-theme.use-case';
import { cn } from '@/ui/lib/utils';
import { useAppTheme } from '@/ui/themes/app-theme-context';

const StyledIonicons = withUniwind(Ionicons);

export const ThemeToggle: FC = () => {
  const { toggleTheme, isLight } = useAppTheme();
  const { cacheAdapter } = useAdapters();

  const isLGAvailable = isLiquidGlassAvailable();

  return (
    <Pressable
      onPress={() => {
        if (Platform.OS === 'ios') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        // Toggle visually
        const newTheme = isLight ? EThemeMode.DARK : EThemeMode.LIGHT;
        toggleTheme();

        // Persist via use-case (fire-and-forget)
        try {
          const usecase = new SetAppThemeUseCase(BASE_LOGGER, cacheAdapter);
          usecase.execute({ theme: newTheme });
        } catch (_e) {
          // ignore persistence errors
        }
      }}
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
