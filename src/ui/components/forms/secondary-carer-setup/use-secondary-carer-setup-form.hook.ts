import React from 'react';
import z from 'zod';

import { useAdapters } from '@/adapter';
import {
  InviteSecondaryCarerQRSchema,
  type TInviteSecondaryCarerQRPayload,
} from '@/domain/carer/dto/invite-secondary-carer.qr.dto';
import { useSecondaryCarerConsumeInvitationQR } from '@/domain/carer/hook/secondary-carer.consume-invitation-qr.hook';
import type { TQRBundle } from '@/domain/core/dto/qr.dto';
import { QR_KEY } from '@/domain/core/enum/qr-key.enum';
import type { TID } from '@/domain/core/schemas/id.schema';
import { useSecondaryCarerSetupStore } from '@/domain/core/stores/secondary-carer-setup.store';
import { useGetModuleListByIDList } from '@/domain/module/hook/get-module-list-by-id-list.hook';
import { useNavigation } from '@/ui/hook/use-navigation.hook';

export function useSecondaryCarerSetupForm() {
  const {
    carerAdapter,
    notifyAdapter,
    qrAdapter,
    cacheAdapter,
    loggerAdapter,
    moduleAdapter,
    navigationAdapter,
    moduleFieldAdapter,
  } = useAdapters();

  const {
    formData,
    currentStep,
    isLoading,
    activeModules,
    setFormData,
    setCurrentStep,
    setIsLoading,
    reset,
    setActiveModules,
  } = useSecondaryCarerSetupStore();

  const { goToRegisterHome } = useNavigation({ navigationAdapter });

  const { execute: consumeInvitationQR, isExecuting: isCreating } =
    useSecondaryCarerConsumeInvitationQR({
      loggerAdapter,
      notifyAdapter,
      carerAdapter,
      cacheAdapter,
      qrAdapter,
      moduleAdapter,
      moduleFieldAdapter,
    });

  const { execute } = useGetModuleListByIDList({
    loggerAdapter,
    moduleAdapter,
    notifyAdapter,
  });

  const handlerGetList = async (idList: TID[]) => {
    const response = await execute({ idList });

    if (response.success) {
      setActiveModules(response.data.items);
    }
  };

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
      await qrAdapter.unpackBundle<TInviteSecondaryCarerQRPayload>(qrBundle);
    loggerAdapter.error({ raw });
    const parse = InviteSecondaryCarerQRSchema.safeParse({
      ...raw,
      [QR_KEY.PAYLOAD]: {
        ...raw[QR_KEY.PAYLOAD],
        [QR_KEY.ORIGIN_CARER_EXPIRES_AT]: new Date(
          raw[QR_KEY.PAYLOAD][QR_KEY.ORIGIN_CARER_EXPIRES_AT]
        ),
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

    loggerAdapter.error({
      activeModuleIDList: parse.data[QR_KEY.PAYLOAD][QR_KEY.MODULE_LIST],
    });

    handlerGetList(
      parse.data[QR_KEY.PAYLOAD][QR_KEY.MODULE_LIST].map(
        (module) => module[QR_KEY.MODULE_ID]
      )
    );

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

    if (result.success) {
      goToRegisterHome();
    }

    return result;
  };

  return {
    currentStep,
    formData,
    activeModules,

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
