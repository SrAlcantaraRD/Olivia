import { addMonths } from 'date-fns';
import { useCallback, useState } from 'react';

import { useAdapters } from '@/adapter';
import { useSecondaryCarerGenerateInvitationQR } from '@/domain/carer/hook/secondary-carer.generate-invitation-qr.hook';
import type { TResponseSecondaryCarerGenerateInvitationQR } from '@/domain/carer/use-case-schema/secondary-carer.generate-invitation-qr.use-case-schema';
import { TIME_TO_LIVE } from '@/domain/core/constant/time-to-live.constants';
import { QR_BUNDLE_VERSION } from '@/domain/core/enum/qr.enum';

export interface GenerateInvitationQRFormData {
  selectedTTL: TIME_TO_LIVE;
  invitationDetails: TResponseSecondaryCarerGenerateInvitationQR;
}

export const DEFAULT_DATA = {
  selectedTTL: TIME_TO_LIVE.ONE_MONTH,
  invitationDetails: {
    qrData: {
      metadata: {
        nonce: '',
        version: QR_BUNDLE_VERSION.V1,
      },
      payload: {
        expiresAt: addMonths(new Date(), 1),
        id: -1,
        name: '',
      },
    },
    qrBundle: '',
    qrChunkList: [],
  },
} satisfies GenerateInvitationQRFormData;

export function useGenerateInvitationQRForm(carerID: number) {
  const {
    carerAdapter,
    notifyAdapter,
    loggerAdapter,
    qrAdapter,
    cacheAdapter,
  } = useAdapters();

  const { execute: generateInvitation, isExecuting: isGenerating } =
    useSecondaryCarerGenerateInvitationQR({
      carerAdapter,
      loggerAdapter,
      notifyAdapter,
      qrAdapter,
      cacheAdapter,
    });

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] =
    useState<GenerateInvitationQRFormData>(DEFAULT_DATA);

  const setSelectedTTL = useCallback((ttl: TIME_TO_LIVE) => {
    setFormData((prev) => ({ ...prev, selectedTTL: ttl }));
  }, []);

  const setInvitationDetails = useCallback(
    (details: TResponseSecondaryCarerGenerateInvitationQR) => {
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
    setFormData(DEFAULT_DATA);
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
