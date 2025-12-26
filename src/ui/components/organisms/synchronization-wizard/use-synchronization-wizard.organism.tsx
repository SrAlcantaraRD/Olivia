import { useMemo } from 'react';

import type { TQRChunk } from '@/domain/core/dto/qr.dto';
import {
  Wizard,
  type WizardStep,
} from '@/ui/components/molecules/wizard.molecule';
import { CollectionStep } from './components/collection-step.component';
import { ConfirmationStep } from './components/confirmation-step.component';
import type { TSynchronizationSummary } from './use-synchronization-wizard.hook';

interface SynchronizationWizardProps {
  currentStepIndex: number;
  collectedChunks: Record<number, TQRChunk>;
  totalChunks: number | null;
  collectedCount: number;
  isCollectionComplete: boolean;
  summary: TSynchronizationSummary;
  handleReadQR: (scannedData: string) => void;
  handleNext: (stepsLength: number) => void;
  handleBack: () => void;
}

export function SynchronizationWizard({
  currentStepIndex,
  collectedChunks,
  totalChunks,
  collectedCount,
  isCollectionComplete,
  summary,
  handleReadQR,
  handleNext,
  handleBack,
}: SynchronizationWizardProps) {
  const steps: WizardStep[] = useMemo(
    () => [
      {
        id: 'collection',
        isValid: isCollectionComplete,
        content: (
          <CollectionStep
            handleReadQR={handleReadQR}
            collectedCount={collectedCount}
            totalChunks={totalChunks}
            collectedChunks={collectedChunks}
          />
        ),
      },
      {
        id: 'confirmation',
        title: 'Confirmation',
        isValid: true,
        content: (
          <ConfirmationStep totalChunks={totalChunks} summary={summary} />
        ),
      },
    ],
    [
      isCollectionComplete,
      handleReadQR,
      collectedCount,
      totalChunks,
      collectedChunks,
      summary,
    ]
  );

  return (
    <Wizard
      testID="screen.settings.synchronization.wizard"
      steps={steps}
      currentStepIndex={currentStepIndex}
      onNext={() => handleNext(steps.length)}
      onBack={handleBack}
      showBackButton={currentStepIndex > 0}
    />
  );
}
