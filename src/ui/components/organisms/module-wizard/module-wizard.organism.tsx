import { useMemo } from 'react';

import type { TRecordCreate } from '@/domain/module/entity/record.entity';
import { ModuleFieldSelectValuesFromJsonStringSchema } from '@/domain/module/schemas/module-field-values.schema';
import { ScreenLayout } from '@/ui/components/layouts/screen.layout';
import { Wizard } from '@/ui/components/molecules/wizard.molecule';
import { ModuleFieldWrapper } from '@/ui/components/organisms/module-wizard/module-field-wrapper.component';
import {
  type IModuleWizardAdapters,
  useModuleWizard,
} from '@/ui/components/organisms/module-wizard/use-module-wizard.hook';

// FIXME: Simplificate processing field values parsing
export function parseFieldValues(values: string | undefined): string[] {
  if (!values) return [];

  const trimmed = values.trim();
  if (!trimmed) return [];

  const result = ModuleFieldSelectValuesFromJsonStringSchema.safeParse(trimmed);
  if (!result.success) return [];
  return result.data;
}

interface ModuleWizardProps {
  moduleID: number;
  onComplete: (data: TRecordCreate) => void;
  testID: string;
  adapters: IModuleWizardAdapters;
  onGoBack?: () => void;
}

export function ModuleWizard({
  moduleID,
  onComplete,
  testID,
  adapters,
  onGoBack,
}: ModuleWizardProps) {
  const {
    currentStep,
    steps,
    values,
    goToNextStep,
    goToPreviousStep,
    setFieldValue,
    selectOptionAndNext,
  } = useModuleWizard({
    moduleID,
    initialValues: {},
    onComplete,
    adapters,
    onGoBack,
  });

  const wizardSteps = useMemo(
    () =>
      steps.map((step) => ({
        id: step.id,
        content: (
          <ScreenLayout
            testID={`${testID}.screen.step.${step.id}`}
            title={step.titleKey}
            subtitle={step.descriptionKey}
          >
            <ModuleFieldWrapper
              step={step}
              values={values}
              setFieldValue={setFieldValue}
              selectOptionAndNext={selectOptionAndNext}
              testID={testID}
            />
          </ScreenLayout>
        ),
        isValid: step.isValid,
      })),
    [steps, values, selectOptionAndNext, setFieldValue, testID]
  );

  const handleNext = () => {
    const lastIndex = wizardSteps.length - 1;
    if (currentStep >= lastIndex) {
      // Transform collected values into the domain create DTO
      const payload: TRecordCreate = {
        moduleID,
        carerID: -1, // to be filled by backend
        synchronized: false,
        createdAt: new Date(),
        recordFieldList: Object.entries(values).map(([fieldId, value]) => ({
          fieldID: Number(fieldId),
          value,
          recordID: -1, // to be filled by backend
        })),
      } satisfies TRecordCreate;

      onComplete(payload);
    } else {
      goToNextStep();
    }
  };

  return (
    <Wizard
      testID={testID}
      steps={wizardSteps}
      currentStepIndex={currentStep}
      onNext={handleNext}
      onBack={goToPreviousStep}
      showBackButton={true}
    />
  );
}
