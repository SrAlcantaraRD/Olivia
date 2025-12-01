import { useHeaderHeight } from '@react-navigation/elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

import { CardContent } from '@/app/(tabs)/design-system/themes-content/card-content';
import { CheckboxContent } from '@/app/(tabs)/design-system/themes-content/checkbox-content';
import { RadioGroupContent } from '@/app/(tabs)/design-system/themes-content/radio-group-content';
import { SwitchContent } from '@/app/(tabs)/design-system/themes-content/switch-content';
import { TextInputContent } from '@/app/(tabs)/design-system/themes-content/text-input-content';
import { AccordionAtom } from '@/ui/components/atoms/accordion.atom';
import {
  TypographyHeading,
  TypographyParagraph,
  TypographySmall,
  TypographySubtitle,
  TypographyTitle,
} from '@/ui/components/atoms/typography.atom';
export default function TabThreeScreen() {
  const headerHeight = useHeaderHeight();

  return (
    <KeyboardAwareScrollView
      className="flex-1 gap-4"
      contentContainerClassName="px-4"
      contentContainerStyle={{
        paddingTop: headerHeight,
        paddingBottom: 12,
      }}
      bottomOffset={60}
    >
      <TypographyTitle i18nKey="welcome" />
      <TypographySubtitle i18nKey="welcome" />
      <TypographyHeading i18nKey="welcome" />
      <TypographyParagraph i18nKey="welcome" />
      <TypographySmall i18nKey="welcome" />
      <AccordionAtom />
      <CardContent />
      <SwitchContent />
      <CheckboxContent />
      <RadioGroupContent />
      <TextInputContent />
    </KeyboardAwareScrollView>
  );
}
