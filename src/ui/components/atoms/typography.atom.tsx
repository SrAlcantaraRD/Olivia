import { useThemeColor } from 'heroui-native';
import * as React from 'react';
import { Text, type TextProps } from 'react-native';

import {
  type ITextTranslationProps,
  TextTranslation,
} from '@/ui/components/atoms/text-translations.atom';
import { cn } from '@/ui/lib/utils';

type TypographyVariant = 'default' | 'primary' | 'light';

type TypographySize =
  | 'xs'
  | 'sm'
  | 'base'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl'
  | '4xl';

type TypographyWeight = 'normal' | 'medium' | 'semibold' | 'bold';

// Simplified size scale for mobile - no responsive breakpoints needed
const SIZE_CLASS: Record<TypographySize, string> = {
  xs: 'text-xs', // 12px - very small text
  sm: 'text-sm', // 14px - small text, captions
  base: 'text-base', // 16px - body text
  lg: 'text-lg', // 18px - emphasized text
  xl: 'text-xl', // 20px - small headings
  '2xl': 'text-2xl', // 24px - medium headings
  '3xl': 'text-3xl', // 30px - large headings
  '4xl': 'text-4xl', // 36px - hero headings
};

const WEIGHT_CLASS: Record<TypographyWeight, string> = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
};

// Color is resolved at render-time using `useThemeColor` so we don't
// include variant color classes here. This keeps color theming centralized
// and avoids duplication between Tailwind classes and runtime theme colors.

// Base typography styles
const BASE_STYLES = {
  title: 'tracking-tight mb-4',
  subtitle: 'tracking-tight mb-3',
  heading: 'tracking-tight mb-2',
  paragraph: 'leading-relaxed',
};

function typographyVariants({
  variant = 'default',
  size = 'base',
  weight = 'normal',
}: Partial<{
  variant: TypographyVariant;
  size: TypographySize;
  weight: TypographyWeight;
}> = {}): string {
  return cn(SIZE_CLASS[size], WEIGHT_CLASS[weight]);
}

interface TypographyProps extends TextProps, ITextTranslationProps {
  className?: string;
  variant?: TypographyVariant;
  size?: TypographySize;
  weight?: TypographyWeight;
  testID: string;
}

const TypographyTitle = React.forwardRef<Text, TypographyProps>(
  (
    {
      className,
      variant = 'primary',
      size = '3xl',
      weight = 'bold',
      i18nKey,
      style,
      values,
      components,
      ...props
    },
    ref
  ) => {
    const accentColor = useThemeColor('accent');
    const foregroundColor = useThemeColor('foreground');
    const mutedColor = useThemeColor('muted');

    const colorMap = {
      default: foregroundColor,
      primary: accentColor,
      light: mutedColor,
    };

    return (
      <Text
        ref={ref}
        style={[{ color: colorMap[variant] }, style]}
        className={cn(
          typographyVariants({ variant, size, weight }),
          BASE_STYLES.title,
          className
        )}
        {...props}
      >
        <TextTranslation
          i18nKey={i18nKey}
          values={values}
          components={components}
        />
      </Text>
    );
  }
);
TypographyTitle.displayName = 'TypographyTitle';

const TypographySubtitle = React.forwardRef<Text, TypographyProps>(
  (
    {
      className,
      variant = 'default',
      size = '2xl',
      weight = 'bold',
      i18nKey,
      style,
      values,
      components,
      ...props
    },
    ref
  ) => {
    const accentColor = useThemeColor('accent');
    const foregroundColor = useThemeColor('foreground');
    const mutedColor = useThemeColor('muted');

    const colorMap = {
      default: foregroundColor,
      primary: accentColor,
      light: mutedColor,
    };

    return (
      <Text
        ref={ref}
        style={[{ color: colorMap[variant] }, style]}
        className={cn(
          typographyVariants({ variant, size, weight }),
          BASE_STYLES.subtitle,
          className
        )}
        {...props}
      >
        <TextTranslation
          i18nKey={i18nKey}
          values={values}
          components={components}
        />
      </Text>
    );
  }
);
TypographySubtitle.displayName = 'TypographySubtitle';

const TypographyHeading = React.forwardRef<Text, TypographyProps>(
  (
    {
      className,
      variant = 'default',
      size = 'xl',
      weight = 'semibold',
      i18nKey,
      style,
      values,
      components,
      ...props
    },
    ref
  ) => {
    const accentColor = useThemeColor('accent');
    const foregroundColor = useThemeColor('foreground');
    const mutedColor = useThemeColor('muted');

    const colorMap = {
      default: foregroundColor,
      primary: accentColor,
      light: mutedColor,
    };

    return (
      <Text
        ref={ref}
        style={[{ color: colorMap[variant] }, style]}
        className={cn(
          typographyVariants({ variant, size, weight }),
          BASE_STYLES.heading,
          className
        )}
        {...props}
      >
        <TextTranslation
          i18nKey={i18nKey}
          values={values}
          components={components}
        />
      </Text>
    );
  }
);
TypographyHeading.displayName = 'TypographyHeading';

const TypographyParagraph = React.forwardRef<Text, TypographyProps>(
  (
    {
      className,
      variant = 'default',
      size = 'base',
      weight = 'normal',
      i18nKey,
      style,
      values,
      components,
      ...props
    },
    ref
  ) => {
    const accentColor = useThemeColor('accent');
    const foregroundColor = useThemeColor('foreground');
    const mutedColor = useThemeColor('muted');

    const colorMap = {
      default: foregroundColor,
      primary: accentColor,
      light: mutedColor,
    };

    return (
      <Text
        ref={ref}
        style={[{ color: colorMap[variant] }, style]}
        className={cn(
          typographyVariants({ variant, size, weight }),
          BASE_STYLES.paragraph,
          className
        )}
        {...props}
      >
        <TextTranslation
          i18nKey={i18nKey}
          values={values}
          components={components}
        />
      </Text>
    );
  }
);

TypographyParagraph.displayName = 'TypographyParagraph';

const TypographySmall = React.forwardRef<Text, TypographyProps>(
  (
    {
      className,
      variant = 'default',
      size = 'sm',
      weight = 'normal',
      i18nKey,
      style,
      values,
      components,
      ...props
    },
    ref
  ) => {
    const accentColor = useThemeColor('accent');
    const foregroundColor = useThemeColor('foreground');
    const mutedColor = useThemeColor('muted');

    const colorMap = {
      default: foregroundColor,
      primary: accentColor,
      light: mutedColor,
    };

    return (
      <Text
        ref={ref}
        style={[{ color: colorMap[variant] }, style]}
        className={cn(typographyVariants({ variant, size, weight }), className)}
        {...props}
      >
        <TextTranslation
          i18nKey={i18nKey}
          values={values}
          components={components}
        />
      </Text>
    );
  }
);
TypographySmall.displayName = 'TypographySmall';

export {
  TypographyHeading,
  TypographyParagraph,
  TypographySmall,
  TypographySubtitle,
  TypographyTitle,
};
