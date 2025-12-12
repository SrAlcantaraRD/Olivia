import { View } from 'react-native';

import { TypographyTitle } from '@/ui/components/atoms/typography.atom';

export default function SymptomAlertModal() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <TypographyTitle
        testID="screen.modal.symptom-alert.title"
        i18nKey="modal.symptom-alert.title"
      />
    </View>
  );
}
