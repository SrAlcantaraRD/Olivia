import { create } from 'zustand';

import type { TInviteSecondaryCarerQR } from '@/domain/carer/dto/invite-secondary-carer.qr.dto';
import type { TQRBundle } from '@/domain/core/dto/qr.dto';
import { DEFAULT_DATA } from '@/ui/components/organisms/generate-invitation-qr-wizard/hooks/use-generate-invitation-qr-form.hook';

interface SecondaryCarerSetupState {
  formData: {
    qrBundle: TQRBundle;
    qrData: TInviteSecondaryCarerQR;
  };
  currentStep: number;
  isLoading: boolean;
}

interface SecondaryCarerSetupActions {
  setFormData: (data: Partial<SecondaryCarerSetupState['formData']>) => void;
  setCurrentStep: (step: number) => void;
  setIsLoading: (loading: boolean) => void;
  reset: () => void;
}

const initialState: SecondaryCarerSetupState = {
  formData: {
    qrBundle: '',
    qrData: DEFAULT_DATA.invitationDetails.qrData,
  },
  currentStep: 0,
  isLoading: false,
};

// TODO: Move to UI inside hook
export const useSecondaryCarerSetupStore = create<
  SecondaryCarerSetupState & SecondaryCarerSetupActions
>((set) => ({
  ...initialState,

  setFormData: (data) =>
    set((state) => ({
      formData: { ...state.formData, ...data },
    })),

  setCurrentStep: (step) => set({ currentStep: step }),

  setIsLoading: (loading) => set({ isLoading: loading }),

  reset: () => set(initialState),
}));
