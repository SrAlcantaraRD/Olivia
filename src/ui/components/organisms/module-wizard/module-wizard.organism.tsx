import { useMemo } from 'react';

import { useAdapters } from '@/adapter';
import type { TModuleField } from '@/domain/module/entity/module-field.entity';
import type { TRecordCreate } from '@/domain/module/entity/record.entity';
import { ScreenLayout } from '@/ui/components/layouts/screen.layout';
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
  const { loggerAdapter, moduleFieldAdapter, notifyAdapter } = useAdapters();

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
    adapters: { loggerAdapter, moduleFieldAdapter, notifyAdapter },
  });

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
          <ScreenLayout
            testID={`${testID}.screen.step.${step.id}`}
            title={step.titleKey}
            subtitle={step.descriptionKey}
          >
            <ModuleFieldWrapper
              step={step as StepItem}
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
