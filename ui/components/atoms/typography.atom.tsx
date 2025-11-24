'use client';

import * as React from 'react';
import { Text, type TextProps } from 'react-native';

// Simple utility to merge class names
function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}

type TypographyVariant = 'default' | 'primary' | 'light';

type TypographySize =
  | 'default'
  | 'xxs'
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | 'xxl'
  | 'xxxl';

type TypographyWeight = 'default' | 'thin' | 'base' | 'semi' | 'bold' | 'black';

// Responsive font sizing scale based on Tailwind defaults:
// Mobile → Small baseline; sm breakpoint elevates by 1–2 steps; lg breakpoint for display sizes.
// Avoids abrupt jumps and removes legacy bespoke values.
const SIZE_CLASS: Record<TypographySize, string> = {
  // default body/heading hybrid size
  default: 'text-base',
  // very small supplemental text
  xxs: 'text-xs sm:text-sm lg:text-base',
  // small heading / emphasized inline
  xs: 'text-base sm:text-lg lg:text-xl',
  // section heading / mid emphasis
  sm: 'text-lg sm:text-xl lg:text-2xl',
  // primary sub-heading
  md: 'text-xl sm:text-2xl lg:text-3xl',
  // large heading
  lg: 'text-2xl sm:text-3xl lg:text-4xl',
  // hero medium
  xl: 'text-3xl sm:text-4xl lg:text-5xl',
  // hero large
  xxl: 'text-4xl sm:text-5xl lg:text-6xl',
  // hero extra large / display
  xxxl: 'text-5xl sm:text-6xl lg:text-7xl',
};

const WEIGHT_CLASS: Record<TypographyWeight, string> = {
  default: 'font-bold',
  thin: 'font-thin',
  base: 'font-normal',
  semi: 'font-semibold',
  bold: 'font-bold',
  black: 'font-black',
};

const VARIANT_CLASS: Record<TypographyVariant, string> = {
  default:
    'text-gray-500 dark:text-gray-400 text-foreground dark:text-foreground-300',
  primary: 'text-primary dark:text-primary-300',
  light: 'text-gray-400 dark:text-gray-500',
};

// Base typography styles that can be extended
const BASE_STYLES = {
  h1: 'tracking-tight mb-4 text-primary dark:text-primary-300',
  h2: 'tracking-tight mb-3 text-gray-900 dark:text-gray-200',
  h3: 'tracking-tight mb-2 text-gray-900 dark:text-gray-200',
  h4: 'tracking-tight mb-2 text-gray-900 dark:text-gray-200',
  lead: 'text-gray-700 dark:text-gray-400',
  code: 'font-mono px-1 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-sm',
  blockquote:
    'pl-4 border-l-4 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 italic bg-gray-50 dark:bg-gray-900 rounded-sm p-4',
  paragraph:
    'text-muted-foreground text-gray-700 dark:text-gray-400 leading-relaxed',
};

function headingVariants({
  variant = 'default',
  size = 'default',
  weight = 'default',
}: Partial<{
  variant: TypographyVariant;
  size: TypographySize;
  weight: TypographyWeight;
}> = {}): string {
  return cn(SIZE_CLASS[size], WEIGHT_CLASS[weight], VARIANT_CLASS[variant]);
}

interface TypographyProps extends TextProps {
  className?: string;
  variant?: TypographyVariant;
  size?: TypographySize;
  weight?: TypographyWeight;
}

const Typography = React.forwardRef<Text, TypographyProps>(
  (
    {
      variant = 'default',
      size = 'default',
      weight = 'default',
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <Text
        ref={ref}
        className={cn(headingVariants({ variant, size, weight }), className)}
        {...props}
      >
        {children}
      </Text>
    );
  }
);
Typography.displayName = 'Typography';

const TypographyH1 = React.forwardRef<Text, TypographyProps>(
  (
    {
      className,
      children,
      variant = 'primary',
      size = 'xl',
      weight = 'bold',
      ...props
    },
    ref
  ) => (
    <Text
      ref={ref}
      className={cn(
        headingVariants({ variant, size, weight }),
        BASE_STYLES.h1,
        className
      )}
      {...props}
    >
      {children}
    </Text>
  )
);
TypographyH1.displayName = 'TypographyH1';

const TypographyH2 = React.forwardRef<Text, TypographyProps>(
  (
    {
      className,
      children,
      variant = 'default',
      size = 'sm',
      weight = 'bold',
      ...props
    },
    ref
  ) => (
    <Text
      ref={ref}
      className={cn(
        headingVariants({ variant, size, weight }),
        BASE_STYLES.h2,
        className
      )}
      {...props}
    >
      {children}
    </Text>
  )
);
TypographyH2.displayName = 'TypographyH2';

const TypographyH3 = React.forwardRef<Text, TypographyProps>(
  (
    {
      className,
      children,
      variant = 'default',
      size = 'xs',
      weight = 'bold',
      ...props
    },
    ref
  ) => (
    <Text
      ref={ref}
      className={cn(
        headingVariants({ variant, size, weight }),
        BASE_STYLES.h3,
        className
      )}
      {...props}
    >
      {children}
    </Text>
  )
);
TypographyH3.displayName = 'TypographyH3';

const TypographyH4 = React.forwardRef<Text, TypographyProps>(
  (
    {
      className,
      children,
      variant = 'default',
      size = 'xxs',
      weight = 'semi',
      ...props
    },
    ref
  ) => (
    <Text
      ref={ref}
      className={cn(
        headingVariants({ variant, size, weight }),
        BASE_STYLES.h4,
        className
      )}
      {...props}
    >
      {children}
    </Text>
  )
);
TypographyH4.displayName = 'TypographyH4';

const TypographyLead = React.forwardRef<Text, TypographyProps>(
  (
    {
      className,
      children,
      variant = 'default',
      size = 'sm',
      weight = 'semi',
      ...props
    },
    ref
  ) => (
    <Text
      ref={ref}
      className={cn(
        headingVariants({ variant, size, weight }),
        BASE_STYLES.lead,
        className
      )}
      {...props}
    >
      {children}
    </Text>
  )
);
TypographyLead.displayName = 'TypographyLead';

const TypographyTitle = React.forwardRef<Text, TypographyProps>(
  (
    {
      className,
      children,
      variant = 'primary',
      size = 'xxs',
      weight = 'semi',
      ...props
    },
    ref
  ) => (
    <Text
      ref={ref}
      className={cn(
        'pb-4',
        headingVariants({ variant, size, weight }),
        className
      )}
      {...props}
    >
      {children}
    </Text>
  )
);
TypographyTitle.displayName = 'TypographyBig';

const TypographySmall = React.forwardRef<Text, TypographyProps>(
  (
    {
      className,
      children,
      variant = 'default',
      size = 'xxs',
      weight = 'base',
      ...props
    },
    ref
  ) => (
    <Text
      ref={ref}
      className={cn(headingVariants({ variant, size, weight }), className)}
      {...props}
    >
      {children}
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
      size = 'xxs',
      weight = 'base',
      ...props
    },
    ref
  ) => (
    <Text
      ref={ref}
      className={cn(headingVariants({ variant, size, weight }), className)}
      {...props}
    >
      {children}
    </Text>
  )
);
TypographyMuted.displayName = 'TypographyMuted';

const TypographyCode = React.forwardRef<Text, TypographyProps>(
  (
    {
      className,
      children,
      variant = 'default',
      size = 'xxs',
      weight = 'base',
      ...props
    },
    ref
  ) => (
    <Text
      ref={ref}
      className={cn(
        headingVariants({ variant, size, weight }),
        BASE_STYLES.code,
        className
      )}
      {...props}
    >
      {children}
    </Text>
  )
);
TypographyCode.displayName = 'TypographyCode';

const TypographyBlockquote = React.forwardRef<Text, TypographyProps>(
  (
    {
      className,
      children,
      variant = 'default',
      size = 'sm',
      weight = 'base',
      ...props
    },
    ref
  ) => (
    <Text
      ref={ref}
      className={cn(
        headingVariants({ variant, size, weight }),
        BASE_STYLES.blockquote,
        className
      )}
      {...props}
    >
      {children}
    </Text>
  )
);
TypographyBlockquote.displayName = 'TypographyBlockquote';

const TypographyParagraph = React.forwardRef<Text, TypographyProps>(
  (
    {
      className,
      children,
      variant = 'default',
      size = 'default',
      weight = 'base',
      ...props
    },
    ref
  ) => (
    <Text
      ref={ref}
      className={cn(
        headingVariants({ variant, size, weight }),
        BASE_STYLES.paragraph,
        className
      )}
      {...props}
    >
      {children}
    </Text>
  )
);
TypographyParagraph.displayName = 'TypographyParagraph';

export {
  Typography,
  TypographyBlockquote,
  TypographyCode,
  TypographyH1,
  TypographyH2,
  TypographyH3,
  TypographyH4,
  TypographyLead,
  TypographyMuted,
  TypographyParagraph,
  TypographySmall,
  TypographyTitle,
};
