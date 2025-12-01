import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';

import { SelectableCard } from '@/ui/components/atoms/selectable-card.atom';
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
  onSelect: () => void;
  accentColor: string;
  mutedColor: string;
  cardBgColor: string;
}

export function ModuleCard({
  icon,
  titleKey,
  descriptionKey,
  isSelected,
  onSelect,
  accentColor,
  mutedColor,
  cardBgColor,
}: ModuleCardProps) {
  return (
    <SelectableCard
      isSelected={isSelected}
      onSelect={onSelect}
      accentColor={accentColor}
      mutedColor={mutedColor}
      cardBgColor={cardBgColor}
      className="p-4 mb-4"
      indicatorPosition="top-left"
      indicatorShape="rounded"
    >
      <View className="flex-row items-start gap-4 pl-8">
        <View
          style={{ backgroundColor: accentColor }}
          className="rounded-2xl p-3 w-12 h-12 items-center justify-center"
        >
          <Ionicons name={icon} size={24} color="white" />
        </View>

        <View className="flex-1">
          <TypographyTitle
            className="mb-1"
            size="lg"
            variant="default"
            i18nKey={titleKey}
          />
          <TypographyParagraph
            size="sm"
            variant="light"
            i18nKey={descriptionKey}
          />
        </View>
      </View>
    </SelectableCard>
  );
}
