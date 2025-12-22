import { useMemo } from 'react';

import { ScreenLayout } from '@/ui/components/layouts/screen.layout';
import {
  Wizard,
  type WizardStep,
} from '@/ui/components/molecules/wizard.molecule';
import { QRInfoStep } from './steps/qr-info-step.component';
import { ScanQRStep } from './steps/scan-qr-step.component';
import { useSecondaryCarerSetupForm } from './use-secondary-carer-setup-form.hook';

interface SecondaryCarerSetupFormProps {
  testID: string;
}

export function SecondaryCarerSetupForm({
  testID,
}: SecondaryCarerSetupFormProps) {
  const {
    currentStep,
    isLoading,
    goToNextStep,
    goToPreviousStep,
    handlerReadQR,
    isStepReadQRValid,
  } = useSecondaryCarerSetupForm();

  const steps: WizardStep[] = useMemo(
    () => [
      {
        id: 'scan-qr',
        isValid: isStepReadQRValid(),
        content: (
          <ScreenLayout
            testID="secondary-carer-setup.scan-qr"
            title="secondary-carer-setup.scan-qr.title"
            subtitle="secondary-carer-setup.scan-qr.description"
            styles={{
              container: 'p-0',
            }}
            isLoading={isLoading}
          >
            <ScanQRStep
              testID="secondary-carer-setup.scan-qr-step"
              onReadQR={handlerReadQR}
            />
          </ScreenLayout>
        ),
      },
      {
        id: 'qr-info',
        isValid: true,
        content: (
          <ScreenLayout
            testID="secondary-carer-setup.qr-info"
            title="secondary-carer-setup.qr-info.title"
            subtitle="secondary-carer-setup.qr-info.description"
            styles={{
              container: 'p-0',
            }}
            isLoading={isLoading}
          >
            <QRInfoStep testID="secondary-carer-setup.qr-info-step" />
          </ScreenLayout>
        ),
      },
    ],
    []
  );

  return (
    <Wizard
      testID={`${testID}.wizard`}
      steps={steps}
      currentStepIndex={currentStep}
      onNext={goToNextStep}
      onBack={goToPreviousStep}
    />
  );
}
