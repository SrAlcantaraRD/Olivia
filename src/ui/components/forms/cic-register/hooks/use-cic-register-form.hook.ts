import { useCallback, useMemo, useState } from 'react';

import type {
  CicColor,
  CicDiscomfort,
  CicRegisterFormData,
  CicTurbidity,
  CicVolume,
} from '../types';
import { INITIAL_FORM_DATA } from '../types';

/**
 * Hook for managing CIC registration form state and validation
 * Follows the same pattern as useParentSetupForm for consistency
 */
export function useCicRegisterForm() {
  const [formData, setFormData] =
    useState<CicRegisterFormData>(INITIAL_FORM_DATA);
  const [currentStep, setCurrentStep] = useState(0);

  // Step 1: Volume selection
  const setVolume = useCallback((volume: CicVolume) => {
    setFormData((prev) => ({ ...prev, volume }));
  }, []);

  const isStep1Valid = useMemo(
    () => formData.volume !== null,
    [formData.volume]
  );

  // Step 2: Color selection
  const setColor = useCallback((color: CicColor) => {
    setFormData((prev) => ({ ...prev, color }));
  }, []);

  const isStep2Valid = useMemo(() => formData.color !== null, [formData.color]);

  // Step 3: Turbidity selection
  const setTurbidity = useCallback((turbidity: CicTurbidity) => {
    setFormData((prev) => ({ ...prev, turbidity }));
  }, []);

  const isStep3Valid = useMemo(
    () => formData.turbidity !== null,
    [formData.turbidity]
  );

  // Step 4: Discomfort selection with optional note
  const setDiscomfort = useCallback((discomfort: CicDiscomfort) => {
    setFormData((prev) => ({ ...prev, discomfort }));
  }, []);

  const setDiscomfortNote = useCallback((note: string) => {
    setFormData((prev) => ({ ...prev, discomfortNote: note }));
  }, []);

  const isStep4Valid = useMemo(
    () => formData.discomfort !== null,
    [formData.discomfort]
  );

  // Step 5: Summary with optional additional notes
  const setAdditionalNotes = useCallback((notes: string) => {
    setFormData((prev) => ({ ...prev, additionalNotes: notes }));
  }, []);

  const isStep5Valid = useMemo(
    () =>
      formData.volume !== null &&
      formData.color !== null &&
      formData.turbidity !== null &&
      formData.discomfort !== null,
    [formData.volume, formData.color, formData.turbidity, formData.discomfort]
  );

  // Navigation functions
  const goToNextStep = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, 4));
  }, []);

  const goToPreviousStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }, []);

  const goToStep = useCallback((step: number) => {
    setCurrentStep(Math.max(0, Math.min(step, 4)));
  }, []);

  // Form reset
  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_DATA);
    setCurrentStep(0);
  }, []);

  return {
    // Form data
    formData,

    // Current step
    currentStep,

    // Setters
    setVolume,
    setColor,
    setTurbidity,
    setDiscomfort,
    setDiscomfortNote,
    setAdditionalNotes,

    // Validation
    isStep1Valid,
    isStep2Valid,
    isStep3Valid,
    isStep4Valid,
    isStep5Valid,

    // Navigation
    goToNextStep,
    goToPreviousStep,
    goToStep,

    // Utilities
    resetForm,
  };
}
