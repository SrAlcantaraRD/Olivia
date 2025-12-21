import { useHeaderHeight } from '@react-navigation/elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useSearchParams } from 'expo-router';
import { View } from 'react-native';

import { useAdapters } from '@/adapter';
import { useNavigation } from '@/hooks/use-navigation.hook';
import { ButtonAtom } from '@/ui/components/atoms/button.atom';
import {
  TypographyParagraph,
  TypographyTitle,
} from '@/ui/components/atoms/typography.atom';

export default function CaregiverConfirmLinkScreen() {
  const { navigationAdapter } = useAdapters();
  const { goToSummaryHome } = useNavigation({ navigationAdapter });
  const { carerName } = useSearchParams();
  const headerHeight = useHeaderHeight();

  return (
    <KeyboardAwareScrollView
      className="flex-1"
      contentContainerClassName="px-4"
      contentContainerStyle={{ paddingTop: headerHeight, paddingBottom: 12 }}
      bottomOffset={60}
    >
      <View className="flex-1 items-center justify-center gap-4">
        <TypographyTitle
          testID="screen.caregiver-setup.confirm-link.title"
          i18nKey="caregiver-setup.confirm-link.title"
        />
        <TypographyParagraph
          testID="screen.caregiver-setup.confirm-link.subtitle"
          i18nKey="page.caregiver-setup.confirm-link.subtitle"
        />
        {carerName && (
          <TypographyParagraph
            testID="screen.caregiver-setup.confirm-link.details"
            i18nKey="page.caregiver-setup.confirm-link.details"
            values={{ name: carerName }}
          />
        )}
        <ButtonAtom
          testID="screen.caregiver-setup.confirm-link.go-home"
          title="page.caregiver-setup.confirm-link.go-home"
          onPress={goToSummaryHome}
        />
      </View>
    </KeyboardAwareScrollView>
  );
}
