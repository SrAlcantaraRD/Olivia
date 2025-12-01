import { View } from 'react-native';

import { CicRegisterForm } from '@/ui/components/forms/cic-register';

/**
 * Modal screen for CIC (Clean Intermittent Catheterization) registration
 * Presents the 5-step wizard in a full-screen modal
 */
export default function ModalRegisterCic() {
  return (
    <View className="flex-1 bg-background">
      <CicRegisterForm />
    </View>
  );
}
