import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from 'heroui-native';
import { View } from 'react-native';

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
  indicatorPosition?: 'top-right' | 'top-left';
}

const ICON_SIZE_MAP = {
  sm: { size: 24, container: 'w-12 h-12 p-3' },
  md: { size: 28, container: 'w-14 h-14 p-3' },
  lg: { size: 32, container: 'w-16 h-16 p-4' },
};

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
  className,
  indicatorPosition,
}: CardWithDetailsProps) {
  const foregroundColor = useThemeColor('foreground');
  const mutedColor = useThemeColor('muted');
  const accentColor = useThemeColor('accent');
  const cardBgColor = useThemeColor('surface');

  // Apply variant defaults
  const finalLayout =
    layout ?? (variant === 'compact' ? 'vertical' : 'horizontal');
  const finalIconSize = iconSize ?? (variant === 'module' ? 'sm' : 'lg');
  const finalClassName =
    className ??
    (variant === 'module'
      ? 'p-4 mb-4'
      : variant === 'compact'
        ? 'p-4 items-center'
        : 'p-6 mb-4');
  const finalIndicatorPosition =
    indicatorPosition ?? (variant === 'module' ? 'top-left' : 'top-right');

  const { size, container } = ICON_SIZE_MAP[finalIconSize];
  const isHorizontal = finalLayout === 'horizontal';

  // Calculate padding based on indicator position
  const contentPadding =
    finalIndicatorPosition === 'top-left' && isHorizontal
      ? 'pl-8'
      : finalIndicatorPosition === 'top-right' && isHorizontal
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
    >
      <View
        className={`${isHorizontal ? 'flex-row items-start gap-4' : 'items-center'} ${contentPadding}`}
      >
        {/* Icon */}
        <View
          style={{ backgroundColor: accentColor }}
          className={`rounded-2xl items-center justify-center ${container} ${!isHorizontal ? 'mb-3' : ''}`}
        >
          <Ionicons name={icon} size={size} color="white" />
        </View>

        {/* Content */}
        <View className={`flex-1 ${!isHorizontal ? 'items-center' : ''}`}>
          {titleKey && (
            <TypographyTitle
              style={{ color: foregroundColor }}
              className={`mb-1 ${!isHorizontal ? 'text-center' : ''}`}
              size="lg"
              i18nKey={titleKey}
            />
          )}

          {subtitleKey && (
            <TypographyParagraph
              style={{ color: accentColor }}
              className="mb-2"
              size="sm"
              weight="medium"
              i18nKey={subtitleKey}
            />
          )}

          {descriptionKey && (
            <TypographyParagraph
              style={{ color: mutedColor }}
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
