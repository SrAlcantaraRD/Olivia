import { useState } from 'react';

import type { ParentSetupFormData, Relationship } from '../types';
import { INITIAL_FORM_DATA } from '../types';

export function useParentSetupForm() {
  const [formData, setFormData] =
    useState<ParentSetupFormData>(INITIAL_FORM_DATA);
  const [currentStep, setCurrentStep] = useState(0);

  // Step 1: Parent Info
  const setParentName = (name: string) => {
    setFormData((prev) => ({ ...prev, parentName: name }));
  };

  const setRelationship = (relationship: Relationship | null) => {
    setFormData((prev) => ({ ...prev, relationship }));
  };

  const isStep1Valid = () => {
    return (
      formData.parentName.trim().length > 0 && formData.relationship !== null
    );
  };

  // Step 2: Child Info
  const setChildName = (name: string) => {
    setFormData((prev) => ({ ...prev, childName: name }));
  };

  const setBirthDate = (date: string) => {
    setFormData((prev) => ({ ...prev, birthDate: date }));
  };

  const setDiagnosis = (diagnosis: string) => {
    setFormData((prev) => ({ ...prev, diagnosis }));
  };

  const isStep2Valid = () => {
    return (
      formData.childName.trim().length > 0 &&
      formData.birthDate.trim().length > 0
    );
  };

  // Step 3: Modules
  const toggleModule = (moduleId: string) => {
    setFormData((prev) => {
      const newModules = new Set(prev.selectedModules);
      if (newModules.has(moduleId)) {
        newModules.delete(moduleId);
      } else {
        newModules.add(moduleId);
      }
      return { ...prev, selectedModules: newModules };
    });
  };

  const isStep3Valid = () => {
    return formData.selectedModules.size > 0;
  };

  // Step 4: Summary (always valid, just review)
  const isStep4Valid = () => {
    return isStep1Valid() && isStep2Valid() && isStep3Valid();
  };

  // Navigation
  const goToNextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const goToPreviousStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const resetForm = () => {
    setFormData(INITIAL_FORM_DATA);
    setCurrentStep(0);
  };

  return {
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
    resetForm,
  };
}
