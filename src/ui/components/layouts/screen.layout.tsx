import { View } from 'react-native';

import { cn } from '@/ui/lib/utils';

interface ScreenLayoutProps {
  children: React.ReactNode;
  testID: string;
  isLoading?: boolean;
  styles?: {
    content?: string;
  };
}

export function ScreenLayout({
  children,
  testID,
  styles,
  isLoading = false,
}: ScreenLayoutProps) {
  return (
    <View
      testID={testID}
      className="flex-1 px-6 pt-4 h-full w-full bg-background"
    >
      <ScreenContentLayout
        className={cn(isLoading ? 'opacity-50' : '', styles?.content)}
      >
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
