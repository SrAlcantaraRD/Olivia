import { View } from 'react-native';

import { IconAtom, type IconName } from '@/ui/components/atoms/icon.atom';
import { SelectableCard } from '@/ui/components/atoms/selectable-card.atom';
import {
  TypographyParagraph,
  TypographyTitle,
} from '@/ui/components/atoms/typography.atom';
import type { Ti18nKeys } from '@/ui/i18n/locales/en-EN';

interface CardWithDetailsProps {
  icon: IconName;
  title?: Ti18nKeys;
  subtitle?: Ti18nKeys;
  description?: Ti18nKeys;
  isSelected: boolean;
  onPress: () => void;
  testID: string;
}

export function CardWithDetails({
  icon,
  title,
  subtitle,
  description,
  isSelected,
  onPress,
  testID,
}: CardWithDetailsProps) {
  return (
    <SelectableCard
      isSelected={isSelected}
      onPress={onPress}
      className="p-4 mb-4"
      testID={`${testID}.selectable-card`}
    >
      <View className="flex-row items-center gap-4">
        {/* Icon */}
        <IconAtom name={icon} variant="contained" />

        {/* Content */}
        <View className="flex-1">
          {title && (
            <TypographyTitle
              testID={`${testID}.title`}
              className="mb-2"
              size="lg"
              i18nKey={title}
            />
          )}

          {subtitle && (
            <TypographyParagraph
              testID={`${testID}.subtitle`}
              variant="light"
              className="mb-2"
              size="sm"
              weight="medium"
              i18nKey={subtitle}
            />
          )}

          {description && (
            <TypographyParagraph
              testID={`${testID}.description`}
              variant="default"
              size="sm"
              i18nKey={description}
            />
          )}
        </View>
      </View>
    </SelectableCard>
  );
}
