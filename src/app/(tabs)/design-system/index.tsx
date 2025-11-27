import { useHeaderHeight } from '@react-navigation/elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

import { AccordionAtom } from '@/ui/components/atoms/accordion.atom';
import {
  TypographyHeading,
  TypographyMuted,
  TypographyParagraph,
  TypographySmall,
  TypographySubtitle,
  TypographyTitle,
} from '@/ui/components/atoms/typography.atom';
import { CardContent } from '@/ui/examples/themes-content/card-content';
import { CheckboxContent } from '@/ui/examples/themes-content/checkbox-content';
import { RadioGroupContent } from '@/ui/examples/themes-content/radio-group-content';
import { SwitchContent } from '@/ui/examples/themes-content/switch-content';
import { TextInputContent } from '@/ui/examples/themes-content/text-input-content';

export default function TabThreeScreen() {
  const headerHeight = useHeaderHeight();

  return (
    <KeyboardAwareScrollView
      className="flex-1"
      contentContainerClassName="gap-12 px-5"
      contentContainerStyle={{
        paddingTop: headerHeight,
        paddingBottom: 12,
      }}
      bottomOffset={60}
    >
      <TypographyTitle i18nKey="welcome" />
      <TypographySubtitle i18nKey="welcome" />
      <TypographyHeading i18nKey="welcome" />
      <TypographyMuted i18nKey="welcome" />
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
