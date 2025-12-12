import { View } from 'react-native';

import { TypographyTitle } from '@/ui/components/atoms/typography.atom';

export default function AddCarerModal() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <TypographyTitle
        testID="screen.modal.add-carer.title"
        i18nKey="modal.add-carer.title"
      />
    </View>
  );
}
