import { useRouter } from 'expo-router';

import {
  FormPage,
  type FormPageStep,
} from '@/ui/components/molecules/form-page.molecule';
import {
  Wizard,
  type WizardStep,
} from '@/ui/components/molecules/wizard.molecule';
import { useParentSetupForm } from './hooks/use-parent-setup-form.hook';
import { ChildInfoStep } from './steps/child-info-step.component';
import { ModulesStep } from './steps/modules-step.component';
import { ParentInfoStep } from './steps/parent-info-step.component';
import { SummaryStep } from './steps/summary-step.component';

export function ParentSetupForm() {
  const router = useRouter();
  const {
    formData,
    currentStep,
    setParentName,
    setRelationship,
    setChildName,
    setBirthDate,
    setDiagnosis,
    toggleModule,
    isStep1Valid,
    isStep2Valid,
    isStep3Valid,
    isStep4Valid,
    goToNextStep,
    goToPreviousStep,
  } = useParentSetupForm();

  const steps: FormPageStep[] = [
    {
      id: 'parent-info',
      titleKey: 'parent-setup.parent-info.title',
      descriptionKey: 'parent-setup.parent-info.description',
      isValid: isStep1Valid(),
      content: (
        <ParentInfoStep
          name={formData.parentName}
          relationship={formData.relationship}
          onNameChange={setParentName}
          onRelationshipChange={setRelationship}
        />
      ),
    },
    {
      id: 'child-info',
      titleKey: 'parent-setup.child-info.title',
      descriptionKey: 'parent-setup.child-info.description',
      isValid: isStep2Valid(),
      content: (
        <ChildInfoStep
          name={formData.childName}
          birthDate={formData.birthDate}
          diagnosis={formData.diagnosis}
          onNameChange={setChildName}
          onBirthDateChange={setBirthDate}
          onDiagnosisChange={setDiagnosis}
        />
      ),
    },
    {
      id: 'modules',
      titleKey: 'parent-setup.modules.title',
      descriptionKey: 'parent-setup.modules.description',
      isValid: isStep3Valid(),
      content: (
        <ModulesStep
          selectedModules={formData.selectedModules}
          onToggleModule={toggleModule}
        />
      ),
    },
    {
      id: 'summary',
      titleKey: 'parent-setup.summary.title',
      descriptionKey: 'parent-setup.summary.description',
      isValid: isStep4Valid(),
      content: <SummaryStep formData={formData} />,
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      goToNextStep();
    } else {
      // Último paso confirmado: navegar a register tab
      router.replace('/(tabs)/register');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      goToPreviousStep();
    } else {
      router.back();
    }
  };

  // Transform FormPageSteps to WizardSteps using FormPage component
  const wizardSteps: WizardStep[] = steps.map((step) => ({
    id: step.id,
    isValid: step.isValid,
    content: <FormPage step={step} />,
  }));

  return (
    <Wizard
      steps={wizardSteps}
      currentStepIndex={currentStep}
      onNext={handleNext}
      onBack={handleBack}
    />
  );
}
