import { useCallback, useEffect, useMemo, useState } from 'react';

import type { TLoggerPort } from '@/domain/core/adapter/logger.adapter';
import type { INotifyPort } from '@/domain/core/port/notify.port';
import type { TModuleField } from '@/domain/module/entity/module-field.entity';
import type { TRecordCreate } from '@/domain/module/entity/record.entity';
import { useGetListModuleField } from '@/domain/module/hook/get-list-module-field.hook';
import type { IModuleFieldPort } from '@/domain/module/port/module-field.port';
import { ModuleWizardField } from '@/ui/components/organisms/module-wizard/module-field-wrapper.component';
import type { Ti18nKeys } from '@/ui/i18n/locales/en-EN';
import { enEN } from '@/ui/i18n/locales/en-EN';

function isTi18nKey(value: string | undefined): value is Ti18nKeys {
  if (!value) return false;
  return Object.hasOwn(enEN, value);
}

const _FALLBACK_TITLE: Ti18nKeys = 'parent-setup.modules.unknown.title';
const FALLBACK_DESCRIPTION: Ti18nKeys =
  'parent-setup.modules.unknown.description';

export interface IModuleWizardAdapters {
  loggerAdapter: TLoggerPort;
  moduleFieldAdapter: IModuleFieldPort;
  notifyAdapter: INotifyPort;
}

export interface IModuleWizardOptions {
  moduleID: number;
  initialValues: Record<number, string>;
  onComplete?: (data: TRecordCreate) => void;
  adapters: IModuleWizardAdapters;
  onGoBack?: () => void;
}

export function useModuleWizard(opts: IModuleWizardOptions) {
  const { moduleID, initialValues, onComplete, adapters, onGoBack } = opts;

  const { loggerAdapter, moduleFieldAdapter, notifyAdapter } = adapters;

  const { execute: executeGetModuleFieldList, items: moduleFieldItems } =
    useGetListModuleField({
      loggerAdapter,
      moduleFieldAdapter,
      notifyAdapter: notifyAdapter,
    });

  useEffect(() => {
    executeGetModuleFieldList({ moduleID });
  }, [moduleID]);

  const fieldList = moduleFieldItems ?? [];
  const [currentStep, setCurrentStep] = useState(0);
  const [values, setValues] = useState<Record<number, string>>(initialValues);

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

  const steps = useMemo(() => {
    return fieldList.map(
      (field) =>
        ({
          id: String(field.id),
          titleKey: field.code as Ti18nKeys,
          descriptionKey: isTi18nKey(field.description)
            ? field.description
            : FALLBACK_DESCRIPTION,
          field: {
            description: field.description || '',
            id: field.id,
            title: field.code || _FALLBACK_TITLE,
            type: field.type,
            values: field.values || null,
          },
          isValid: isFieldValid(field),
        }) satisfies ModuleWizardField
    );
  }, [fieldList, isFieldValid]);

  const goToNextStep = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1));
  }, [totalSteps]);

  const goToPreviousStep = useCallback(() => {
    if (currentStep === 0) {
      onGoBack?.();
    } else {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep, onGoBack]);

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
      setTimeout(() => {
        if (currentStep + 1 >= totalSteps) {
          const payload: TRecordCreate = {
            moduleID,
            carerID: 0,
            synchronized: false,
            recordFieldList: [{ fieldID: fieldId, value, recordID: -1 }],
            createdAt: new Date(),
          };
          onComplete?.(payload);
        } else {
          goToNextStep();
        }
      }, 500);
    },
    [
      goToNextStep,
      setFieldValue,
      currentStep,
      totalSteps,
      onComplete,
      moduleID,
      values,
    ]
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
