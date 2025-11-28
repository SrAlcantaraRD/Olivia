import { Ionicons } from '@expo/vector-icons';
import { Pressable, View } from 'react-native';

import {
  TypographyParagraph,
  TypographyTitle,
} from '@/ui/components/atoms/typography.atom';
import type { Ti18nKeys } from '@/ui/i18n/locales/en-EN';

interface ModuleCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  titleKey: Ti18nKeys;
  descriptionKey: Ti18nKeys;
  isSelected: boolean;
  onToggle: () => void;
  accentColor: string;
  foregroundColor: string;
  mutedColor: string;
  cardBgColor: string;
}

export function ModuleCard({
  icon,
  titleKey,
  descriptionKey,
  isSelected,
  onToggle,
  accentColor,
  foregroundColor,
  mutedColor,
  cardBgColor,
}: ModuleCardProps) {
  return (
    <Pressable
      onPress={onToggle}
      style={{
        backgroundColor: cardBgColor,
        borderWidth: 2,
        borderColor: isSelected ? accentColor : 'transparent',
      }}
      className="rounded-3xl p-4 mb-4"
    >
      <View className="flex-row items-start gap-4">
        <View
          style={{
            borderWidth: 2,
            borderColor: isSelected ? accentColor : mutedColor,
            backgroundColor: isSelected ? accentColor : 'transparent',
          }}
          className="w-6 h-6 rounded items-center justify-center mt-1"
        >
          {isSelected && <Ionicons name="checkmark" size={16} color="white" />}
        </View>

        <View
          style={{ backgroundColor: accentColor }}
          className="rounded-2xl p-3 w-12 h-12 items-center justify-center"
        >
          <Ionicons name={icon} size={24} color="white" />
        </View>

        <View className="flex-1">
          <TypographyTitle
            style={{ color: foregroundColor }}
            className="mb-1"
            size="lg"
            i18nKey={titleKey}
          />
          <TypographyParagraph
            style={{ color: mutedColor }}
            size="sm"
            i18nKey={descriptionKey}
          />
        </View>
      </View>
    </Pressable>
  );
}
