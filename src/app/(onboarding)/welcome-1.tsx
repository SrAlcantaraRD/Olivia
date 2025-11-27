import { useHeaderHeight } from '@react-navigation/elements';
import { useRouter } from 'expo-router';
import React from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

import { ButtonAtom } from '@/ui/components/atoms/button.atom';
import { TypographyTitle } from '@/ui/components/atoms/typography.atom';

export default function Onboarding1Screen() {
  const router = useRouter();
  const headerHeight = useHeaderHeight();

  return (
    <KeyboardAwareScrollView
      className="flex-1"
      contentContainerClassName="px-4"
      contentContainerStyle={{
        paddingTop: headerHeight,
        paddingBottom: 12,
      }}
      bottomOffset={60}
    >
      <TypographyTitle>Welcome-1</TypographyTitle>
      <ButtonAtom
        title="welcome"
        onPress={() => router.push('/(onboarding)/welcome-2')}
      />
    </KeyboardAwareScrollView>
  );
}
