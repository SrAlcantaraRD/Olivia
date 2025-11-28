import { useRouter } from 'expo-router';
import React from 'react';

import { ButtonAtom } from '@/ui/components/atoms/button.atom';
import { TypographyTitle } from '@/ui/components/atoms/typography.atom';
import { ScreenScrollView } from '@/ui/components/screen-scroll-view.atom';

export default function SplashScreen() {
  const router = useRouter();

  return (
    <ScreenScrollView>
      <TypographyTitle>SplashScreen</TypographyTitle>
      <ButtonAtom
        title="start-onboarding"
        onPress={() => router.push('/(onboarding)/welcome-1')}
      />
    </ScreenScrollView>
  );
}
