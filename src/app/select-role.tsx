import { useRouter } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

import { ButtonAtom } from '@/ui/components/atoms/button.atom';
import { TypographyTitle } from '@/ui/components/atoms/typography.atom';
import { ScreenScrollView } from '@/ui/components/screen-scroll-view.atom';

export default function SelectRoleScreen() {
  const router = useRouter();

  return (
    <ScreenScrollView>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <TypographyTitle>SelectRoleScreen</TypographyTitle>
        <ButtonAtom
          title="parent"
          onPress={() => router.push('/(parent-setup)/parent-info')}
        />
        <ButtonAtom
          title="caregiver"
          onPress={() => router.push('/(caregiver-setup)/scan-qr')}
        />
      </View>
    </ScreenScrollView>
  );
}
