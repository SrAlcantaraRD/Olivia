import { useHeaderHeight } from '@react-navigation/elements';
import { useRouter } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

import { ButtonAtom } from '@/ui/components/atoms/button.atom';
import { TypographyTitle } from '@/ui/components/atoms/typography.atom';

export default function ParentInfoScreen() {
  const router = useRouter();
  const headerHeight = useHeaderHeight();

  return (
    <KeyboardAwareScrollView
      className="flex-1"
      contentContainerClassName="px-4"
      contentContainerStyle={{ paddingTop: headerHeight, paddingBottom: 12 }}
      bottomOffset={60}
    >
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <TypographyTitle>ParentInfoScreen</TypographyTitle>
        <ButtonAtom
          title="next"
          onPress={() => router.push('/(parent-setup)/child-info')}
        />
      </View>
    </KeyboardAwareScrollView>
  );
}
