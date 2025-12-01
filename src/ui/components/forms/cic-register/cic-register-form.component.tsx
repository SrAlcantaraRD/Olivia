import { useRouter } from 'expo-router';
import { useCallback } from 'react';

import {
  Wizard,
  type WizardStep,
} from '@/ui/components/molecules/wizard.molecule';
import { useCicRegisterForm } from './hooks/use-cic-register-form.hook';
import { ColorStep } from './steps/color-step.component';
import { DiscomfortStep } from './steps/discomfort-step.component';
import { SummaryStep } from './steps/summary-step.component';
import { TurbidityStep } from './steps/turbidity-step.component';
import { VolumeStep } from './steps/volume-step.component';

/**
 * CIC Registration Form Component
 * Orchestrates the 5-step wizard for registering a CIC (Clean Intermittent Catheterization)
 * Follows the same pattern as ParentSetupForm for consistency
 */
export function CicRegisterForm() {
  const router = useRouter();
  const {
    formData,
    currentStep,
    setVolume,
    setColor,
    setTurbidity,
    setDiscomfort,
    setDiscomfortNote,
    setAdditionalNotes,
    isStep1Valid,
    isStep2Valid,
    isStep3Valid,
    isStep4Valid,
    isStep5Valid,
    goToNextStep,
    goToPreviousStep,
    resetForm,
  } = useCicRegisterForm();

  // Define wizard steps
  const steps: WizardStep[] = [
    {
      id: 'volume',
      content: (
        <VolumeStep
          selectedVolume={formData.volume}
          onVolumeSelect={setVolume}
        />
      ),
      isValid: isStep1Valid,
    },
    {
      id: 'color',
      content: (
        <ColorStep selectedColor={formData.color} onColorSelect={setColor} />
      ),
      isValid: isStep2Valid,
    },
    {
      id: 'turbidity',
      content: (
        <TurbidityStep
          selectedTurbidity={formData.turbidity}
          onTurbiditySelect={setTurbidity}
        />
      ),
      isValid: isStep3Valid,
    },
    {
      id: 'discomfort',
      content: (
        <DiscomfortStep
          selectedDiscomfort={formData.discomfort}
          discomfortNote={formData.discomfortNote}
          onDiscomfortSelect={setDiscomfort}
          onDiscomfortNoteChange={setDiscomfortNote}
        />
      ),
      isValid: isStep4Valid,
    },
    {
      id: 'summary',
      content: (
        <SummaryStep
          formData={formData}
          onAdditionalNotesChange={setAdditionalNotes}
        />
      ),
      isValid: isStep5Valid,
    },
  ];

  // Handle wizard navigation
  const handleNext = useCallback(() => {
    if (currentStep < steps.length - 1) {
      goToNextStep();
    } else {
      // Final step - save and navigate back
      // TODO: Implement DB save logic in future (Phase 10+)
      console.log('CIC Registration Data:', formData);
      resetForm();
      router.back();
    }
  }, [currentStep, steps.length, goToNextStep, formData, resetForm, router]);

  const handleBack = useCallback(() => {
    if (currentStep > 0) {
      goToPreviousStep();
    } else {
      // First step - go back without saving
      resetForm();
      router.back();
    }
  }, [currentStep, goToPreviousStep, resetForm, router]);

  return (
    <Wizard
      steps={steps}
      currentStepIndex={currentStep}
      totalSteps={5}
      onNext={handleNext}
      onBack={handleBack}
      showBackButton={true}
      showSkipButton={false}
    />
  );
}
