import { View } from 'react-native';

import { TypographyTitle } from '@/ui/components/atoms/typography.atom';

export default function FilterHistoryModal() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <TypographyTitle
        testID="screen.modal.filter-history.title"
        i18nKey="modal.filter-history.title"
      />
    </View>
  );
}
