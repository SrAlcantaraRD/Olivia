import { format } from 'date-fns';
import { useThemeColor } from 'heroui-native';
import { useMemo } from 'react';
import { View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

import { getTimeToLiveOptions } from '@/domain/core/constant/time-to-live.constants';
import { QR_KEY } from '@/domain/core/enum/qr-key.enum';
import { TypographySmall } from '@/ui/components/atoms/typography.atom';
import { ScreenLayout } from '@/ui/components/layouts/screen.layout';
import { CardWithDetails } from '@/ui/components/molecules/card-with-details.molecule';
import {
  Wizard,
  type WizardStep,
} from '@/ui/components/molecules/wizard.molecule';
import { TTL_ICONS } from '@/ui/components/particles/ttl-icons.particle';
import { useGenerateInvitationQRForm } from './hooks/use-generate-invitation-qr-form.hook';

interface GenerateInvitationQRWizardProps {
  carerID: number;
  testID: string;
}

export function GenerateInvitationQRWizard({
  carerID,
  testID,
}: GenerateInvitationQRWizardProps) {
  const accentColor = useThemeColor('accent');

  const {
    formData,
    currentStep,
    setSelectedTTL,
    goToNextStep,
    goToPreviousStep,
    isStep1Valid,
    generateQR,
    reset,
    isGenerating,
  } = useGenerateInvitationQRForm(carerID);

  const steps: WizardStep[] = useMemo(
    () => [
      {
        id: 'ttl-selection',
        isValid: isStep1Valid(),
        content: (
          <ScreenLayout
            testID="generate-invitation-qr.ttl-selection"
            title="page.carer-management.ttl.heading"
            subtitle="page.carer-management.invitation-modal.subtitle"
            styles={{
              container: 'p-0',
            }}
          >
            <View className="gap-4">
              {getTimeToLiveOptions().map((option) => (
                <CardWithDetails
                  key={option.value}
                  title={option.label}
                  isSelected={formData.selectedTTL === option.value}
                  onPress={() => setSelectedTTL(option.value)}
                  testID={`modal.invite.ttl-${option.value}`}
                  icon={TTL_ICONS[option.value]}
                />
              ))}
            </View>
          </ScreenLayout>
        ),
      },
      {
        id: 'qr-preview',
        isValid: true,
        content: (
          <ScreenLayout
            testID="generate-invitation-qr.qr-preview"
            title="page.carer-management.invitation-modal.title"
            subtitle="page.carer-management.invitation-modal.subtitle"
            isLoading={isGenerating}
          >
            <View className="gap-4">
              <View className="items-center">
                <QRCode
                  value={formData.invitationDetails?.qrBundle}
                  color={accentColor}
                  size={250}
                />
              </View>
              <View className="gap-2">
                <TypographySmall
                  i18nKey="page.carer-management.invitation-modal.ttl"
                  values={{
                    ttl: formData.selectedTTL,
                    expiresAt: format(
                      formData.invitationDetails?.qrData[QR_KEY.PAYLOAD][
                        QR_KEY.ORIGIN_CARER_EXPIRES_AT
                      ],
                      'yyyy-MM-dd'
                    ),
                  }}
                  testID="modal.invite.ttl"
                />

                <TypographySmall
                  className="opacity-30"
                  variant="light"
                  size="xs"
                  i18nKey="page.carer-management.invitation-modal.bundle"
                  values={{
                    value: JSON.stringify(formData.invitationDetails?.qrData),
                  }}
                  testID="modal.invite.bundle"
                />

                <TypographySmall
                  className="opacity-30"
                  variant="light"
                  size="xs"
                  i18nKey="page.carer-management.invitation-modal.bundle"
                  values={{
                    value: JSON.stringify(formData.invitationDetails?.qrBundle),
                  }}
                  testID="modal.invite.bundle"
                />
              </View>
            </View>
          </ScreenLayout>
        ),
      },
    ],
    [
      formData.selectedTTL,
      formData.invitationDetails,
      isStep1Valid,
      isGenerating,
      accentColor,
      setSelectedTTL,
      reset,
    ]
  );

  const handleNext = async () => {
    if (currentStep === 0) {
      // Generate QR before moving to next step
      await generateQR();
      goToNextStep();
    }
    // For step 1, buttons are handled in content (copy/close)
  };

  const handleBack = () => {
    if (currentStep > 0) {
      goToPreviousStep();
    }
  };

  return (
    <Wizard
      testID={`${testID}.wizard`}
      steps={steps}
      currentStepIndex={currentStep}
      onNext={handleNext}
      onBack={handleBack}
      showBackButton={currentStep > 0}
    />
  );
}
