import { useHeaderHeight } from '@react-navigation/elements';
import { View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

import { useAdapters } from '@/adapter';
import { useNavigation } from '@/hooks/use-navigation.hook';
import { ButtonAtom } from '@/ui/components/atoms/button.atom';
import { TypographyTitle } from '@/ui/components/atoms/typography.atom';

export default function ScanQRScreen() {
  const { navigationAdapter } = useAdapters();
  const { goToConfirmLink } = useNavigation({
    navigationAdapter,
  });

  const headerHeight = useHeaderHeight();

  return (
    <KeyboardAwareScrollView
      className="flex-1"
      contentContainerClassName="px-4"
      contentContainerStyle={{ paddingTop: headerHeight, paddingBottom: 12 }}
      bottomOffset={60}
    >
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <TypographyTitle
          testID="screen.caregiver-setup.scan-qr.title"
          i18nKey="caregiver-setup.scan-qr.title"
        />
        <ButtonAtom
          title="next"
          onPress={goToConfirmLink}
          testID="page.caregiver-setup.scan-qr.next-button"
        />
      </View>
    </KeyboardAwareScrollView>
  );
}
