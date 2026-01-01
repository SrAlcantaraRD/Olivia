import { ScreenLayout } from '@/ui/components/layouts/screen.layout';
import { useSynchronizationWizard } from '@/ui/components/organisms/synchronization-wizard/use-synchronization-wizard.hook';
import { SynchronizationWizard } from '@/ui/components/organisms/synchronization-wizard/use-synchronization-wizard.organism';

export default function SynchronizationScreen() {
  const syncState = useSynchronizationWizard();

  return (
    <ScreenLayout
      testID="screen.settings.synchronization"
      isLoading={syncState.isExecutingConsume || syncState.isDecoding}
    >
      <SynchronizationWizard {...syncState} />
    </ScreenLayout>
  );
}
