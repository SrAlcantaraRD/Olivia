import type { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from 'heroui-native';
import { View } from 'react-native';

import { IconAtom } from '@/ui/components/atoms/icon.atom';
import { SelectableCard } from '@/ui/components/atoms/selectable-card.atom';
import {
  TypographyParagraph,
  TypographyTitle,
} from '@/ui/components/atoms/typography.atom';
import type { Ti18nKeys } from '@/ui/i18n/locales/en-EN';

type Variant = 'default' | 'module' | 'compact';

interface CardWithDetailsProps {
  icon: keyof typeof Ionicons.glyphMap;
  titleKey?: Ti18nKeys;
  subtitleKey?: Ti18nKeys;
  descriptionKey?: Ti18nKeys;
  isSelected: boolean;
  onSelect: () => void;
  variant?: Variant;
  className?: string;
  hideIndicator?: boolean;
}

export function CardWithDetails({
  icon,
  titleKey,
  subtitleKey,
  descriptionKey,
  isSelected,
  onSelect,
  variant = 'default',
  hideIndicator = false,
  className,
}: CardWithDetailsProps) {
  const mutedColor = useThemeColor('muted');
  const accentColor = useThemeColor('accent');
  const cardBgColor = useThemeColor('surface');

  // Apply variant defaults
  const finalClassName =
    className ??
    (variant === 'module'
      ? 'p-4 mb-4'
      : variant === 'compact'
        ? 'p-4'
        : 'p-6 mb-4');

  return (
    <SelectableCard
      isSelected={isSelected}
      onSelect={onSelect}
      accentColor={accentColor}
      mutedColor={mutedColor}
      cardBgColor={cardBgColor}
      className={finalClassName}
      showIndicator={!hideIndicator}
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
