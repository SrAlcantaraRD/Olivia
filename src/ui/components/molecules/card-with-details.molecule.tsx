import type { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';

import { IconAtom } from '@/ui/components/atoms/icon.atom';
import { SelectableCard } from '@/ui/components/atoms/selectable-card.atom';
import {
  TypographyParagraph,
  TypographyTitle,
} from '@/ui/components/atoms/typography.atom';
import type { Ti18nKeys } from '@/ui/i18n/locales/en-EN';

interface CardWithDetailsProps {
  icon: keyof typeof Ionicons.glyphMap;
  titleKey?: Ti18nKeys;
  subtitleKey?: Ti18nKeys;
  descriptionKey?: Ti18nKeys;
  isSelected: boolean;
  onSelect: () => void;
}

export function CardWithDetails({
  icon,
  titleKey,
  subtitleKey,
  descriptionKey,
  isSelected,
  onSelect,
}: CardWithDetailsProps) {
  return (
    <SelectableCard
      isSelected={isSelected}
      onSelect={onSelect}
      className="p-4 mb-4"
    >
      <View className="flex-row items-center gap-4">
        {/* Icon */}
        <IconAtom name={icon} variant="contained" />

        {/* Content */}
        <View className="flex-1">
          {titleKey && (
            <TypographyTitle className="mb-2" size="lg" i18nKey={titleKey} />
          )}

          {subtitleKey && (
            <TypographyParagraph
              variant="light"
              className="mb-2"
              size="sm"
              weight="medium"
              i18nKey={subtitleKey}
            />
          )}

          {descriptionKey && (
            <TypographyParagraph
              variant="default"
              size="sm"
              i18nKey={descriptionKey}
            />
          )}
        </View>
      </View>
    </SelectableCard>
  );
}
