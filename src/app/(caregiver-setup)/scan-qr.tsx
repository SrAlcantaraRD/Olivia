import { useHeaderHeight } from '@react-navigation/elements';
import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

import { ButtonAtom } from '@/ui/components/atoms/button.atom';
import { TypographyTitle } from '@/ui/components/atoms/typography.atom';

export default function ScanQRScreen() {
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
        <TypographyTitle i18nKey="caregiver-setup.scan-qr.title" />
        <ButtonAtom
          title="next"
          onPress={() => router.push('/(caregiver-setup)/confirm-link')}
        />
      </View>
    </KeyboardAwareScrollView>
  );
}
