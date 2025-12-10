import { CicRegisterForm } from '@/ui/components/forms/cic-register';
import { ScreenLayout } from '@/ui/components/layouts/screen.layout';

/**
 * Modal screen for CIC (Clean Intermittent Catheterization) registration
 * Presents the 5-step wizard in a full-screen modal
 */
export default function ModalRegisterCic() {
  return (
    <ScreenLayout testID="modal-register">
      <CicRegisterForm />
    </ScreenLayout>
  );
}
