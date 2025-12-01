import { View } from 'react-native';

import { TypographyTitle } from '@/ui/components/atoms/typography.atom';

export default function SwitchAccountModal() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <TypographyTitle i18nKey="modal.switch-account.title" />
    </View>
  );
}
