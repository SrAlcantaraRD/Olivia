import { useLocalSearchParams } from 'expo-router';

import { ScreenLayout } from '@/ui/components/layouts/screen.layout';
import { GenerateInvitationQRWizard } from '@/ui/components/organisms/generate-invitation-qr-wizard/generate-invitation-qr-wizard.organism';

export default function GenerateInvitationQRScreen() {
  const params = useLocalSearchParams<{ carerID: string }>();
  const carerID = Number(params.carerID ?? 0);

  return (
    <ScreenLayout testID="page.carer-management.generate-invitation-qr">
      <GenerateInvitationQRWizard
        carerID={carerID}
        testID="generate-invitation-qr"
      />
    </ScreenLayout>
  );
}
