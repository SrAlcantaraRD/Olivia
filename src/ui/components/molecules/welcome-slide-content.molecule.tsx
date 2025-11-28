import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from 'heroui-native';
import { View } from 'react-native';

import {
  TypographyParagraph,
  TypographySubtitle,
} from '@/ui/components/atoms/typography.atom';
import type { Ti18nKeys } from '@/ui/i18n/locales/en-EN';

interface WelcomeSlideContentProps {
  illustration: {
    outerIcon?: keyof typeof Ionicons.glyphMap;
    innerIcon: keyof typeof Ionicons.glyphMap;
    innerIconSize?: number;
    innerShape?: 'rounded-full' | 'rounded-3xl';
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
    <View className="flex-1 justify-center items-center">
      {/* Illustration */}
      <View className="bg-[#C8CAE5] rounded-full w-64 h-64 my-12 items-center justify-center">
        <View
          className={`bg-[#9B9FC5] ${illustration.innerShape} p-8 items-center justify-center`}
        >
          <Ionicons
            name={illustration.innerIcon}
            size={illustration.innerIconSize || 60}
            color="#7B7FA5"
          />
          {illustration.secondaryIcon && (
            <Ionicons
              name={illustration.secondaryIcon.name}
              size={illustration.secondaryIcon.size || 40}
              color="#7B7FA5"
              style={{
                position: 'absolute',
                ...illustration.secondaryIcon.position,
              }}
            />
          )}
        </View>
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
  );
}
