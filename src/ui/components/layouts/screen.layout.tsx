import { View } from 'react-native';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CardAtom } from '@/ui/components/atoms/card.atom';
import {
  TypographySubtitle,
  TypographyTitle,
} from '@/ui/components/atoms/typography.atom';
import type { Ti18nKeys } from '@/ui/i18n/locales/en-EN';
import { cn } from '@/ui/lib/utils';

interface ScreenLayoutProps {
  children: React.ReactNode;
  testID: string;
  isLoading?: boolean;
  styles?: {
    container?: string;
    content?: string;
  };
  title?: Ti18nKeys;
  subtitle?: Ti18nKeys;
}

export function ScreenLayout({
  children,
  testID,
  styles,
  isLoading = false,
  title,
  subtitle,
}: ScreenLayoutProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      testID={testID}
      className={cn(
        'flex-1 p-4 h-full w-full bg-background',
        styles?.container
      )}
      style={{ paddingTop: insets.top }}
    >
      <ScreenContentLayout
        className={cn(isLoading ? 'opacity-50' : '', styles?.content)}
      >
        {(title || subtitle) && (
          <Animated.View
            key={`header-${title}-${subtitle}`}
            entering={FadeInRight.duration(250)}
            exiting={FadeOutLeft.duration(200)}
          >
            <CardAtom variant="transparent" className="gap-4 px-0">
              {title && (
                <TypographyTitle
                  testID="screen.settings.title"
                  i18nKey={title}
                  accessibilityRole="header"
                  className="mb-0"
                />
              )}
              {subtitle && (
                <TypographySubtitle
                  size="lg"
                  testID="screen.settings.subtitle"
                  accessibilityRole="header"
                  i18nKey={subtitle}
                  variant="light"
                />
              )}
            </CardAtom>
          </Animated.View>
        )}

        {children}
      </ScreenContentLayout>
    </View>
  );
}

function ScreenContentLayout({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <View className={cn('flex-1 w-full h-full', className)}>{children}</View>
  );
}
