import { View } from 'react-native';

import { TypographyTitle } from '@/ui/components/atoms/typography.atom';

export default function QuickRecordModal() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <TypographyTitle
        testID="screen.modal.quick-record.title"
        i18nKey="modal.quick-record.title"
      />
    </View>
  );
}
