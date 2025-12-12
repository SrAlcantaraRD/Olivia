import { useMemo } from 'react';
import { View } from 'react-native';

import type { TModuleField } from '@/domain/module/entity/module-field.entity';
import type { TRecordCreate } from '@/domain/module/entity/record.entity';
import { FormPage } from '@/ui/components/molecules/form-page.molecule';
import { Wizard } from '@/ui/components/molecules/wizard.molecule';
import { ModuleFieldWrapper } from '@/ui/components/organisms/module-wizard/module-field-wrapper.component';
import { useModuleWizard } from '@/ui/components/organisms/module-wizard/use-module-wizard.hook';
import type { Ti18nKeys } from '@/ui/i18n/locales/en-EN';

// FIXME: Simplificate processing field values parsing
export function parseFieldValues(values: string | undefined): string[] {
  if (!values) return [];
  return JSON.parse(values);
}

interface ModuleWizardProps {
  moduleID: number;
  onComplete: (data: TRecordCreate) => void;
  testID: string;
}

export function ModuleWizard({
  moduleID,
  onComplete,
  testID,
}: ModuleWizardProps) {
  const {
    currentStep,
    steps,
    values,
    goToNextStep,
    goToPreviousStep,
    setFieldValue,
    selectOptionAndNext,
  } = useModuleWizard({ moduleID, initialValues: {} });

  type StepItem = {
    id: string;
    titleKey: Ti18nKeys;
    descriptionKey: Ti18nKeys;
    field: TModuleField;
    isValid: boolean;
  };

  const wizardSteps = useMemo(
    () =>
      steps.map((step) => ({
        id: step.id,
        content: (
          <FormPage
            key={`page-${step.id}`}
            testID={`${testID}.form-page.step.${step.id}`}
            step={{
              id: step.id,
              titleKey: step.titleKey,
              descriptionKey: step.descriptionKey,
              content: (
                <View className="mt-4">
                  <ModuleFieldWrapper
                    step={step as StepItem}
                    values={values}
                    setFieldValue={setFieldValue}
                    selectOptionAndNext={selectOptionAndNext}
                    testID={testID}
                  />
                </View>
              ),
              isValid: step.isValid,
            }}
          />
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
        carerID: 0, // load from cache
        data: JSON.stringify(values),
        synced: false,
        fieldList: Object.entries(values).map(([fieldId, value]) => ({
          fieldID: Number(fieldId),
          value,
        })),
      } satisfies TRecordCreate;

      onComplete(payload);
    } else {
      goToNextStep();
    }
  };

  return (
    <Wizard
      steps={wizardSteps}
      currentStepIndex={currentStep}
      onNext={handleNext}
      onBack={goToPreviousStep}
      showBackButton={true}
      testID={testID}
    />
  );
}
