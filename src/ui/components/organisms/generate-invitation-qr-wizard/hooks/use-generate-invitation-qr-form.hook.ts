import { useCallback, useState } from 'react';

import { useAdapters } from '@/adapter';
import { useGenerateInvitationQRForSecondaryCarer } from '@/domain/carer/hook/generate-invitation-qr-for-secondary-carer.hook';
import type { TResponseGenerateInvitationQRForSecondaryCarer } from '@/domain/carer/use-case-schema/generate-invitation-qr-for-secondary-carer.use-case-schema';
import { TIME_TO_LIVE } from '@/domain/core/constant/time-to-live.constants';

export interface GenerateInvitationQRFormData {
  selectedTTL: TIME_TO_LIVE;
  invitationDetails: TResponseGenerateInvitationQRForSecondaryCarer | null;
}

export function useGenerateInvitationQRForm(carerID: number) {
  const {
    carerAdapter,
    notifyAdapter,
    loggerAdapter,
    qrAdapter,
    cacheAdapter,
  } = useAdapters();

  const { execute: generateInvitation, isExecuting: isGenerating } =
    useGenerateInvitationQRForSecondaryCarer({
      carerAdapter,
      loggerAdapter,
      notifyAdapter,
      qrAdapter,
      cacheAdapter,
    });

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<GenerateInvitationQRFormData>({
    selectedTTL: TIME_TO_LIVE.ONE_MONTH,
    invitationDetails: null,
  });

  const setSelectedTTL = useCallback((ttl: TIME_TO_LIVE) => {
    setFormData((prev) => ({ ...prev, selectedTTL: ttl }));
  }, []);

  const setInvitationDetails = useCallback(
    (details: TResponseGenerateInvitationQRForSecondaryCarer | null) => {
      setFormData((prev) => ({ ...prev, invitationDetails: details }));
    },
    []
  );

  const goToNextStep = useCallback(() => {
    setCurrentStep((prev) => prev + 1);
  }, []);

  const goToPreviousStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  }, []);

  const isStep1Valid = useCallback(() => {
    return true; // TTL selection is always valid (has default)
  }, []);

  const isStep2Valid = useCallback(() => {
    return !!formData.invitationDetails; // QR must be generated
  }, [formData.invitationDetails]);

  const generateQR = useCallback(async () => {
    const response = await generateInvitation({
      carerID,
      timeToLive: formData.selectedTTL,
    });

    if (response.success && response.data) {
      setInvitationDetails(response.data);
      return response.data;
    }

    return null;
  }, [generateInvitation, carerID, formData.selectedTTL, setInvitationDetails]);

  const reset = useCallback(() => {
    setCurrentStep(0);
    setFormData({
      selectedTTL: TIME_TO_LIVE.ONE_MONTH,
      invitationDetails: null,
    });
  }, []);

  return {
    formData,
    currentStep,
    setSelectedTTL,
    setInvitationDetails,
    goToNextStep,
    goToPreviousStep,
    isStep1Valid,
    isStep2Valid,
    generateQR,
    reset,
    isGenerating,
  };
}
