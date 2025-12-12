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
        <TypographyTitle
          testID="screen.caregiver-setup.confirm-link.title"
          i18nKey="caregiver-setup.confirm-link.title"
        />
        <ButtonAtom
          title="welcome"
          onPress={() => router.replace('/(tabs)/register')}
          testID="screen.caregiver-setup.confirm-link.welcome-button"
        />
      </View>
    </KeyboardAwareScrollView>
  );
}
