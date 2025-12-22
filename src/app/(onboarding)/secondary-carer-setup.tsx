import { SecondaryCarerSetupForm } from '@/ui/components/forms/secondary-carer-setup/secondary-carer-setup-form.component';
import { ScreenLayout } from '@/ui/components/layouts/screen.layout';

export default function SecondaryCarerSetupScreen() {
  return (
    <ScreenLayout testID="secondary-carer-setup-screen">
      <SecondaryCarerSetupForm testID="secondary-carer-setup-form" />
    </ScreenLayout>
  );
}
