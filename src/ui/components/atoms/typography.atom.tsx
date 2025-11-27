import * as React from 'react';
import { Text, type TextProps } from 'react-native';

import { TextTranslation } from '@/ui/components/atoms/text-translations.atom';
import type { Ti18nKeys } from '@/ui/i18n/locales/en-EN';
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

const VARIANT_CLASS: Record<TypographyVariant, string> = {
  default: 'text-foreground',
  primary: 'text-primary',
  light: 'text-muted-foreground',
};

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
  return cn(SIZE_CLASS[size], WEIGHT_CLASS[weight], VARIANT_CLASS[variant]);
}

interface TypographyProps extends TextProps {
  i18nKey?: Ti18nKeys;
  className?: string;
  variant?: TypographyVariant;
  size?: TypographySize;
  weight?: TypographyWeight;
}

const Typography = React.forwardRef<Text, TypographyProps>(
  (
    {
      variant = 'default',
      size = 'base',
      weight = 'normal',
      className,
      children,
      i18nKey,
      ...props
    },
    ref
  ) => {
    return (
      <Text
        ref={ref}
        className={cn(typographyVariants({ variant, size, weight }), className)}
        {...props}
      >
        {i18nKey ? <TextTranslation i18nKey={i18nKey} /> : children}
      </Text>
    );
  }
);
Typography.displayName = 'Typography';

const TypographyTitle = React.forwardRef<Text, TypographyProps>(
  (
    {
      className,
      children,
      variant = 'primary',
      size = '3xl',
      weight = 'bold',
      i18nKey,
      ...props
    },
    ref
  ) => (
    <Text
      ref={ref}
      className={cn(
        typographyVariants({ variant, size, weight }),
        BASE_STYLES.title,
        className
      )}
      {...props}
    >
      {i18nKey ? <TextTranslation i18nKey={i18nKey} /> : children}
    </Text>
  )
);
TypographyTitle.displayName = 'TypographyTitle';

const TypographySubtitle = React.forwardRef<Text, TypographyProps>(
  (
    {
      className,
      children,
      variant = 'default',
      size = '2xl',
      weight = 'bold',
      i18nKey,
      ...props
    },
    ref
  ) => (
    <Text
      ref={ref}
      className={cn(
        typographyVariants({ variant, size, weight }),
        BASE_STYLES.subtitle,
        className
      )}
      {...props}
    >
      {i18nKey ? <TextTranslation i18nKey={i18nKey} /> : children}
    </Text>
  )
);
TypographySubtitle.displayName = 'TypographySubtitle';

const TypographyHeading = React.forwardRef<Text, TypographyProps>(
  (
    {
      className,
      children,
      variant = 'default',
      size = 'xl',
      weight = 'semibold',
      i18nKey,
      ...props
    },
    ref
  ) => (
    <Text
      ref={ref}
      className={cn(
        typographyVariants({ variant, size, weight }),
        BASE_STYLES.heading,
        className
      )}
      {...props}
    >
      {i18nKey ? <TextTranslation i18nKey={i18nKey} /> : children}
    </Text>
  )
);
TypographyHeading.displayName = 'TypographyHeading';

const TypographyParagraph = React.forwardRef<Text, TypographyProps>(
  (
    {
      className,
      children,
      variant = 'default',
      size = 'base',
      weight = 'normal',
      i18nKey,
      ...props
    },
    ref
  ) => (
    <Text
      ref={ref}
      className={cn(
        typographyVariants({ variant, size, weight }),
        BASE_STYLES.paragraph,
        className
      )}
      {...props}
    >
      {i18nKey ? <TextTranslation i18nKey={i18nKey} /> : children}
    </Text>
  )
);
TypographyParagraph.displayName = 'TypographyParagraph';

const TypographySmall = React.forwardRef<Text, TypographyProps>(
  (
    {
      className,
      children,
      variant = 'default',
      size = 'sm',
      weight = 'normal',
      i18nKey,
      ...props
    },
    ref
  ) => (
    <Text
      ref={ref}
      className={cn(typographyVariants({ variant, size, weight }), className)}
      {...props}
    >
      {i18nKey ? <TextTranslation i18nKey={i18nKey} /> : children}
    </Text>
  )
);
TypographySmall.displayName = 'TypographySmall';

const TypographyMuted = React.forwardRef<Text, TypographyProps>(
  (
    {
      className,
      children,
      variant = 'light',
      size = 'sm',
      weight = 'normal',
      i18nKey,
      ...props
    },
    ref
  ) => (
    <Text
      ref={ref}
      className={cn(typographyVariants({ variant, size, weight }), className)}
      {...props}
    >
      {i18nKey ? <TextTranslation i18nKey={i18nKey} /> : children}
    </Text>
  )
);
TypographyMuted.displayName = 'TypographyMuted';

export {
  Typography,
  TypographyHeading,
  TypographyMuted,
  TypographyParagraph,
  TypographySmall,
  TypographySubtitle,
  TypographyTitle,
};
