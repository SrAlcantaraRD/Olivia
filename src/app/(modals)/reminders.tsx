import { View } from 'react-native';

import { TypographyTitle } from '@/ui/components/atoms/typography.atom';

export default function RemindersModal() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <TypographyTitle
        testID="screen.modal.reminders.title"
        i18nKey="modal.reminders.title"
      />
    </View>
  );
}
