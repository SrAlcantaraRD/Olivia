import { addMonths } from 'date-fns';
import { useCallback, useState } from 'react';

import { useAdapters } from '@/adapter';
import { useSecondaryCarerGenerateInvitationQR } from '@/domain/carer/hook/secondary-carer.generate-invitation-qr.hook';
import type { TResponseSecondaryCarerGenerateInvitationQR } from '@/domain/carer/use-case-schema/secondary-carer.generate-invitation-qr.use-case-schema';
import { TIME_TO_LIVE } from '@/domain/core/constant/time-to-live.constants';
import { QR_BUNDLER_VERSION } from '@/domain/core/enum/qr.enum';
import { QR_KEY } from '@/domain/core/enum/qr-key.enum';

export interface GenerateInvitationQRFormData {
  selectedTTL: TIME_TO_LIVE;
  invitationDetails: TResponseSecondaryCarerGenerateInvitationQR;
}

export const DEFAULT_DATA = {
  selectedTTL: TIME_TO_LIVE.ONE_MONTH,
  invitationDetails: {
    qrData: {
      [QR_KEY.METADATA]: {
        [QR_KEY.VERSION]: QR_BUNDLER_VERSION.V1,
      },
      [QR_KEY.PAYLOAD]: {
        [QR_KEY.ORIGIN_CARER_ID]: -1,
        [QR_KEY.ORIGIN_CARER_NAME]: '',
        [QR_KEY.ORIGIN_CARER_EXPIRES_AT]: addMonths(new Date(), 1),
        [QR_KEY.MODULE_LIST]: [],
      },
    },
    qrBundle: '',
  },
} satisfies GenerateInvitationQRFormData;

export function useGenerateInvitationQRForm(carerID: number) {
  const {
    carerAdapter,
    notifyAdapter,
    loggerAdapter,
    qrAdapter,
    cacheAdapter,
    moduleAdapter,
  } = useAdapters();

  const { execute: generateInvitation, isExecuting: isGenerating } =
    useSecondaryCarerGenerateInvitationQR({
      carerAdapter,
      loggerAdapter,
      notifyAdapter,
      qrAdapter,
      cacheAdapter,
      moduleAdapter,
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
