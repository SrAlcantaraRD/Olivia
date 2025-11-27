import { useRouter } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

import { ButtonAtom } from '@/ui/components/atoms/button.atom';
import { TypographyTitle } from '@/ui/components/atoms/typography.atom';
import ScreenScrollView from './_components/ScreenScrollView';

export default function SplashScreen() {
  const router = useRouter();

  return (
    <ScreenScrollView>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <TypographyTitle>SplashScreen</TypographyTitle>
        <ButtonAtom
          title="Start onboarding"
          onPress={() => router.push('/(onboarding)/welcome-1')}
        />
      </View>
    </ScreenScrollView>
  );
}
