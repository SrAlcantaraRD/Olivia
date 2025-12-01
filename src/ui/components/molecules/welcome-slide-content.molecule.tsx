import type { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from 'heroui-native';
import { View } from 'react-native';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';

import { IllustrationAtom } from '@/ui/components/atoms/illustration.atom';
import {
  TypographyParagraph,
  TypographySubtitle,
} from '@/ui/components/atoms/typography.atom';
import type { Ti18nKeys } from '@/ui/i18n/locales/en-EN';

interface WelcomeSlideContentProps {
  illustration: {
    icon: keyof typeof Ionicons.glyphMap;
    iconSize?: number;
    shape?: 'rounded-full' | 'rounded-3xl';
    secondaryIcon?: {
      name: keyof typeof Ionicons.glyphMap;
      size?: number;
      position?: { bottom?: number; right?: number };
    };
  };
  title: Ti18nKeys;
  description?: Ti18nKeys;
  bulletPoints?: Ti18nKeys[];
}

export function WelcomeSlideContent({
  illustration,
  title,
  description,
  bulletPoints,
}: WelcomeSlideContentProps) {
  const foregroundColor = useThemeColor('foreground');
  const mutedColor = useThemeColor('muted');
  const accentColor = useThemeColor('accent');

  return (
    <Animated.View
      key={`header-${title}`}
      entering={FadeInRight.duration(250)}
      exiting={FadeOutLeft.duration(200)}
      className="flex-1"
    >
      <View className="flex-1 justify-center items-center">
        {/* Illustration */}
        <View className="my-12">
          <IllustrationAtom
            icon={illustration.icon}
            iconSize={illustration.iconSize}
            shape={illustration.shape}
            secondaryIcon={illustration.secondaryIcon}
            size="lg"
          />
        </View>

        {/* Title */}
        <TypographySubtitle
          style={{ color: foregroundColor }}
          className={`text-center ${bulletPoints ? 'mb-6' : 'mb-4'}`}
          i18nKey={title}
        />

        {/* Description or Bullet Points */}
        {description && (
          <TypographyParagraph
            style={{ color: mutedColor }}
            className="text-center"
            i18nKey={description}
          />
        )}

        {bulletPoints && (
          <View className="gap-3 w-full mt-4">
            {bulletPoints.map((item) => (
              <View key={item} className="flex-row items-center gap-3">
                <View
                  style={{ backgroundColor: accentColor }}
                  className="w-1.5 h-1.5 rounded-full"
                />
                <TypographyParagraph
                  style={{ color: mutedColor }}
                  i18nKey={item}
                />
              </View>
            ))}
          </View>
        )}
      </View>
    </Animated.View>
  );
}
