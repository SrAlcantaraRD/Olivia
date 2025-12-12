import { useCallback, useMemo, useState } from 'react';

import type { TModuleField } from '@/domain/module/entity/module-field.entity';
import type { TModule } from '@/domain/module/entity/module.entity';
import type { TRecordCreate } from '@/domain/module/entity/record.entity';
import type { Ti18nKeys } from '@/ui/i18n/locales/en-EN';

export interface IModuleWizardOptions {
  module: TModule;
  initialValues?: TRecordCreate;
}

export function useModuleWizard(opts: IModuleWizardOptions) {
  const { module, initialValues = {} } = opts;

  const fieldList = module.fieldList ?? [];
  const [currentStep, setCurrentStep] = useState(0);
  const [values, setValues] = useState<TRecordCreate>(initialValues);

  const totalSteps = fieldList.length;

  const isFieldValid = useCallback(
    (field: TModuleField) => {
      const value = values[field.id];
      if (field.required) {
        return Boolean(value && String(value).length > 0);
      }
      return true;
    },
    [values]
  );

  const steps = useMemo(
    () =>
      fieldList.map((field) => ({
        id: String(field.id),
        titleKey: field.title as unknown as Ti18nKeys,
        descriptionKey: field.description as unknown as Ti18nKeys,
        field,
        isValid: isFieldValid(field),
      })),
    []
  );

  const goToNextStep = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1));
  }, [totalSteps]);

  const goToPreviousStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }, []);

  const goToStep = useCallback(
    (idx: number) => {
      setCurrentStep(Math.max(0, Math.min(idx, totalSteps - 1)));
    },
    [totalSteps]
  );

  const setFieldValue = useCallback((fieldId: number, value: string) => {
    setValues((prev) => ({ ...prev, [fieldId]: value }));
  }, []);

  const selectOptionAndNext = useCallback(
    (fieldId: number, value: string) => {
      setFieldValue(fieldId, value);
      setTimeout(() => goToNextStep(), 150);
    },
    [goToNextStep, setFieldValue]
  );

  const currentField = fieldList[currentStep];

  return {
    fieldList,
    currentStep,
    steps,
    values,
    currentField,

    // nav
    goToNextStep,
    goToPreviousStep,
    goToStep,

    // data
    setFieldValue,
    selectOptionAndNext,
    isFieldValid,
  } as const;
}

export default useModuleWizard;
