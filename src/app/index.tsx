import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from 'heroui-native';
import { useEffect, useRef } from 'react';
import { Animated, Pressable, View } from 'react-native';

import { useAdapters } from '@/adapter';
import { dropDatabase } from '@/database/config/drop-database.config';
import { BASE_LOGGER } from '@/domain/core/adapter/logger.adapter';
import { useNavigation } from '@/hooks/use-navigation.hook';
import { useSplashCarerValidation } from '@/hooks/use-splash-carer-validation.hook';
import { AtomLogoSVG } from '@/ui/components/atoms/logo.atom';
import {
  TypographyHeading,
  TypographyParagraph,
  TypographySmall,
} from '@/ui/components/atoms/typography.atom';
import { ScreenLayout } from '@/ui/components/layouts/screen.layout';
import { cn } from '@/ui/lib/utils';

export default function SplashScreen() {
  const { notifyAdapter, carerAdapter, navigationAdapter } = useAdapters();
  const { goToOnboarding } = useNavigation({ navigationAdapter });

  const foregroundColor = useThemeColor('foreground');
  const mutedColor = useThemeColor('muted');
  const accentColor = useThemeColor('accent');

  // Animation for the continue button
  const bounceAnim = useRef(new Animated.Value(0)).current;

  const { execute: checkCarerExistence, isExecuting } =
    useSplashCarerValidation({
      loggerAdapter: BASE_LOGGER,
      notifyAdapter,
      carerAdapter,
      navigationAdapter,
    });

  const handlerCheckExistence = async () => {
    await checkCarerExistence();
  };

  useEffect(() => {
    // Bounce animation loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -15,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [bounceAnim]);

  useEffect(() => {
    handlerCheckExistence();
  }, []);

  const handleContinue = () => {
    goToOnboarding();
  };

  const handleResetDb = async () => {
    await dropDatabase();
  };

  useEffect(() => {
    notifyAdapter.loading({
      title: 'welcome',
      description: 'common.view_all',
    });
  }, []);

  return (
    <ScreenLayout
      testID="splash-screen"
      styles={{
        content: 'justify-center items-center',
      }}
    >
      {/* Logo Section */}
      <View className="items-center mb-16">
        <View
          style={{ backgroundColor: accentColor }}
          className="rounded-4xl p-12 mb-8 items-center justify-center w-48 h-48"
        >
          <AtomLogoSVG width={80} height={80} />
        </View>

        <TypographyHeading
          style={{ color: foregroundColor }}
          className="mb-2"
          size="4xl"
          i18nKey="splash-screen.app-name"
        />

        <TypographyParagraph
          style={{ color: mutedColor }}
          className="text-center"
          i18nKey="splash-screen.tagline"
        />
      </View>

      {/* Continue Button */}
      <Pressable
        testID="continue-button"
        onPress={handleContinue}
        className={cn(
          'absolute bottom-32 items-center',
          isExecuting && 'hidden'
        )}
      >
        <Animated.View
          style={{
            transform: [{ translateY: bounceAnim }],
          }}
          className="mb-3"
        >
          <View
            style={{ backgroundColor: accentColor }}
            className="rounded-full p-4 w-16 h-16 items-center justify-center"
          >
            <AtomLogoSVG width={40} height={40} />
          </View>
        </Animated.View>
        <TypographyParagraph
          style={{ color: foregroundColor }}
          i18nKey="continue"
        />
      </Pressable>

      {__DEV__ && (
        <Pressable testID="reset-db-button" onPress={handleResetDb}>
          <TypographySmall
            style={{ color: mutedColor }}
            i18nKey="test.reset-db"
          />
        </Pressable>
      )}

      {/* Privacy Notice */}
      <View className="absolute bottom-12 items-center flex-row gap-2 px-6">
        <Ionicons
          name="information-circle-outline"
          size={20}
          color={mutedColor}
        />
        <TypographySmall
          style={{ color: mutedColor }}
          className="text-center"
          i18nKey="splash-screen.privacy-notice"
        />
      </View>
    </ScreenLayout>
  );
}
