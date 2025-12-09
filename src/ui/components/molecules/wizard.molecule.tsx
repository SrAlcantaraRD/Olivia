import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from 'heroui-native';
import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';

import { AtomCircularProgressButton } from '@/ui/components/atoms/circular-progress-button.atom';
import { AtomLogoSVG } from '@/ui/components/atoms/logo.atom';
import { AtomPaginationDots } from '@/ui/components/atoms/pagination-dots.atom';
import { TypographySmall } from '@/ui/components/atoms/typography.atom';

export interface WizardStep {
  id: string;
  content: ReactNode;
  isValid: boolean;
}

interface WizardProps {
  steps: WizardStep[];
  currentStepIndex: number;
  totalSteps?: number;
  onNext: () => void;
  onBack: () => void;
  onSkip?: () => void;
  showBackButton?: boolean;
  showSkipButton?: boolean;
  testID: string;
}

export function Wizard({
  steps,
  currentStepIndex,
  totalSteps: totalStepsProp,
  onNext,
  onBack,
  onSkip,
  showBackButton = true,
  showSkipButton = false,
  testID,
}: WizardProps) {
  const foregroundColor = useThemeColor('foreground');
  const mutedColor = useThemeColor('muted');
  const accentColor = useThemeColor('accent');

  const currentStep = steps[currentStepIndex] ?? steps[0];
  const totalSteps = totalStepsProp ?? steps.length;
  const progress = (currentStepIndex + 1) / totalSteps;

  const handleNext = () => {
    if (currentStep?.isValid) {
      onNext();
    }
  };

  const handleBack = () => {
    onBack();
  };

  const handleSkip = () => {
    onSkip?.();
  };

  return (
    <View testID={testID} className="flex-1 bg-background">
      {/* Header */}
      <View className="flex-row items-center justify-between">
        {showBackButton ? (
          <Pressable onPress={handleBack}>
            <Ionicons name="chevron-back" size={24} color={foregroundColor} />
          </Pressable>
        ) : (
          <View className="w-8" />
        )}
        <AtomLogoSVG width={40} height={40} />
        {showSkipButton && onSkip ? (
          <Pressable onPress={handleSkip}>
            <TypographySmall
              style={{ color: mutedColor }}
              className="text-base"
              i18nKey="skip"
            />
          </Pressable>
        ) : (
          <View className="w-8" />
        )}
      </View>

      {/* Content */}
      <View className="flex-1">{currentStep.content}</View>

      {/* Footer with Pagination and Next Button */}
      <View className="pb-12 gap-6 flex flex-row items-center">
        <View className="flex-1">
          <AtomPaginationDots
            total={totalSteps}
            currentIndex={currentStepIndex}
            activeColor={accentColor}
            inactiveColor={mutedColor}
            maxWidth={undefined}
          />
        </View>

        {/* Next Button - tamaño fijo */}
        <AtomCircularProgressButton
          onPress={handleNext}
          progress={progress}
          backgroundColor={currentStep?.isValid ? accentColor : mutedColor}
          progressColor={accentColor}
          size={84}
          iconSize={36}
          testID={
            currentStepIndex === steps.length - 1
              ? 'summary-save-button'
              : 'next-button'
          }
        />
      </View>
    </View>
  );
}
