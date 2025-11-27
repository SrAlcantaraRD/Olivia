import { useHeaderHeight } from '@react-navigation/elements';
import React from 'react';
import { View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

import { TypographyTitle } from '@/ui/components/atoms/typography.atom';

export default function NewRecordScreen() {
  const headerHeight = useHeaderHeight();

  return (
    <KeyboardAwareScrollView
      className="flex-1"
      contentContainerClassName="px-4"
      contentContainerStyle={{ paddingTop: headerHeight, paddingBottom: 12 }}
      bottomOffset={60}
    >
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <TypographyTitle>NewRecordScreen</TypographyTitle>
      </View>
    </KeyboardAwareScrollView>
  );
}
