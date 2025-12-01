import { useHeaderHeight } from '@react-navigation/elements';
import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

import { ButtonAtom } from '@/ui/components/atoms/button.atom';
import { TypographyTitle } from '@/ui/components/atoms/typography.atom';

export default function CaregiverConfirmLinkScreen() {
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
        <TypographyTitle>CaregiverConfirmLinkScreen</TypographyTitle>
        <ButtonAtom
          title="welcome"
          onPress={() => router.replace('/(app)/(tabs)/dashboard')}
        />
      </View>
    </KeyboardAwareScrollView>
  );
}
