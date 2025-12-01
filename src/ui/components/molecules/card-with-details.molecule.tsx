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

type Layout = 'horizontal' | 'vertical';
type IconSize = 'sm' | 'md' | 'lg';
type Variant = 'default' | 'module' | 'compact';

interface CardWithDetailsProps {
  icon: keyof typeof Ionicons.glyphMap;
  titleKey?: Ti18nKeys;
  subtitleKey?: Ti18nKeys;
  descriptionKey?: Ti18nKeys;
  isSelected: boolean;
  onSelect: () => void;
  variant?: Variant;
  layout?: Layout;
  iconSize?: IconSize;
  flex?: boolean;
  className?: string;
  showIndicator?: boolean;
  indicatorPosition?: 'top-right' | 'top-left';
}

export function CardWithDetails({
  icon,
  titleKey,
  subtitleKey,
  descriptionKey,
  isSelected,
  onSelect,
  variant = 'default',
  layout,
  iconSize,
  flex = false,
  showIndicator = true,
  className,
  indicatorPosition,
}: CardWithDetailsProps) {
  const mutedColor = useThemeColor('muted');
  const accentColor = useThemeColor('accent');
  const cardBgColor = useThemeColor('surface');

  // Apply variant defaults
  const finalLayout =
    layout ?? (variant === 'compact' ? 'vertical' : 'horizontal');
  const finalClassName =
    className ??
    (variant === 'module'
      ? 'p-4 mb-4'
      : variant === 'compact'
        ? 'p-4 items-center'
        : 'p-6 mb-4');
  const finalIndicatorPosition =
    indicatorPosition ?? (variant === 'module' ? 'top-left' : 'top-right');

  const isHorizontal = finalLayout === 'horizontal';

  // Calculate padding based on indicator position
  const contentPadding =
    finalIndicatorPosition === 'top-left' && isHorizontal && showIndicator
      ? 'pl-8'
      : finalIndicatorPosition === 'top-right' && isHorizontal && showIndicator
        ? 'pr-8'
        : '';

  return (
    <SelectableCard
      isSelected={isSelected}
      onSelect={onSelect}
      accentColor={accentColor}
      mutedColor={mutedColor}
      cardBgColor={cardBgColor}
      className={finalClassName}
      flex={flex}
      indicatorPosition={finalIndicatorPosition}
      indicatorShape="rounded"
      showIndicator={showIndicator}
    >
      <View
        className={`${isHorizontal ? 'flex-row items-start gap-4' : 'items-center'} ${contentPadding} ${!isHorizontal ? 'mb-3' : ''}`}
      >
        {/* Icon */}
        <IconAtom name={icon} variant="contained" />

        {/* Content */}
        <View className={`flex-1 ${!isHorizontal ? 'items-center' : ''}`}>
          {titleKey && (
            <TypographyTitle
              className={`mb-1 ${!isHorizontal ? 'text-center' : ''}`}
              size="lg"
              i18nKey={titleKey}
            />
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
              className={!isHorizontal ? 'text-center' : ''}
              size="sm"
              i18nKey={descriptionKey}
            />
          )}
        </View>
      </View>
    </SelectableCard>
  );
}
