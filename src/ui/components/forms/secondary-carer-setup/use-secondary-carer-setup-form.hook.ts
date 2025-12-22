import React from 'react';
import z from 'zod';

import { useAdapters } from '@/adapter';
import {
  InviteSecondaryCarerQRSchema,
  type TInviteSecondaryCarerQR,
} from '@/domain/carer/dto/invite-secondary-carer.qr.dto';
import { useSecondaryCarerConsumeInvitationQR } from '@/domain/carer/hook/secondary-carer.consume-invitation-qr.hook';
import type { TQRBundle } from '@/domain/core/dto/qr.dto';
import { useSecondaryCarerSetupStore } from '@/domain/core/stores/secondary-carer-setup.store';

export function useSecondaryCarerSetupForm() {
  const {
    carerAdapter,
    notifyAdapter,
    qrAdapter,
    cacheAdapter,
    loggerAdapter,
  } = useAdapters();

  const {
    formData,
    currentStep,
    isLoading,
    setFormData,
    setCurrentStep,
    setIsLoading,
    reset,
  } = useSecondaryCarerSetupStore();

  const { execute: consumeInvitationQR, isExecuting: isCreating } =
    useSecondaryCarerConsumeInvitationQR({
      loggerAdapter,
      notifyAdapter,
      carerAdapter,
      cacheAdapter,
      qrAdapter,
    });

  // Sync isLoading with the hook's isExecuting
  React.useEffect(() => {
    setIsLoading(isCreating);
  }, [isCreating]);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);

  const isStepReadQRValid = () => {
    loggerAdapter.error({ isValid: formData.qrBundle.length > 0 });
    return formData.qrBundle.length > 0;
  };

  const handlerReadQR = async (qrBundle: TQRBundle) => {
    const raw =
      await qrAdapter.decodeFromBundle<TInviteSecondaryCarerQR>(qrBundle);

    const parse = InviteSecondaryCarerQRSchema.safeParse({
      ...raw,
      payload: {
        ...raw.payload,
        expiresAt: new Date(raw.payload.expiresAt),
      },
    });

    if (!parse.success) {
      const errorList = z.treeifyError(parse.error).errors;
      loggerAdapter.error({
        message: 'Invalid QR data',
        errors: errorList,
      });
      return;
    }

    loggerAdapter.error(parse.data);

    setFormData({
      qrBundle,
      qrData: parse.data,
    });

    setCurrentStep(currentStep + 1);
  };

  // Navigation
  const goToNextStep = () => {
    if (currentStep === 0 && isStepReadQRValid()) {
      setCurrentStep(currentStep + 1);
      return;
    }

    if (currentStep === 1) {
      handlerConfirmInvitation();
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Save
  const handlerConfirmInvitation = async () => {
    if (!isStepReadQRValid()) {
      return { success: false };
    }

    const result = await consumeInvitationQR({
      qrBundle: formData.qrBundle,
    });

    return result;
  };

  return {
    currentStep,
    formData,

    // Step 1: QR Scanning
    handlerReadQR,
    isStepReadQRValid,

    // Step 2: Confirmation
    handlerConfirmInvitation,

    // Navigation
    goToNextStep,
    goToPreviousStep,

    // Loading states
    isLoading,
  };
}
