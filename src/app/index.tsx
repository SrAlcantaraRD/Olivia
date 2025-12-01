import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useThemeColor } from 'heroui-native';
import { useEffect, useRef } from 'react';
import { Animated, Pressable, View } from 'react-native';

import { AtomLogoSVG } from '@/ui/components/atoms/logo.atom';
import {
  TypographyHeading,
  TypographyParagraph,
  TypographySmall,
} from '@/ui/components/atoms/typography.atom';

export default function SplashScreen() {
  const router = useRouter();
  const backgroundColor = useThemeColor('background');
  const foregroundColor = useThemeColor('foreground');
  const mutedColor = useThemeColor('muted');
  const accentColor = useThemeColor('accent');

  // Animation for the continue button
  const bounceAnim = useRef(new Animated.Value(0)).current;

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

  const handleContinue = () => {
    router.push('/(onboarding)/welcome');
  };

  return (
    <View
      style={{ backgroundColor, flex: 1 }}
      className="flex-1 items-center justify-center px-6"
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
        onPress={handleContinue}
        className="absolute bottom-32 items-center"
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
    </View>
  );
}
