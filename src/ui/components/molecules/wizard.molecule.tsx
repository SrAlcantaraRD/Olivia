import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from 'heroui-native';
import type { ReactNode } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';

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
  showLogo?: boolean;
  showProgress?: boolean;
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
  showLogo = true,
  showProgress = true,
}: WizardProps) {
  const backgroundColor = useThemeColor('background');
  const foregroundColor = useThemeColor('foreground');
  const mutedColor = useThemeColor('muted');
  const accentColor = useThemeColor('accent');

  const currentStep = steps[currentStepIndex] ?? steps[0];
  const totalSteps = totalStepsProp ?? steps.length;
  const progress = (currentStepIndex + 1) / totalSteps;
  const isFirstSlide = currentStepIndex === 0;

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
    <View style={{ backgroundColor, flex: 1 }}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 pt-12 pb-4">
        {showBackButton && !isFirstSlide ? (
          <Pressable onPress={handleBack}>
            <Ionicons name="chevron-back" size={24} color={foregroundColor} />
          </Pressable>
        ) : (
          <View className="w-8" />
        )}
        {showLogo && <AtomLogoSVG width={40} height={40} />}
        {!showLogo && <View className="w-8" />}
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
      <ScrollView
        className="flex-1 px-6"
        contentContainerStyle={{
          paddingTop: 0,
          paddingBottom: 140,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Step Content */}
        <Animated.View
          key={`content-${currentStepIndex}`}
          entering={FadeInRight.duration(250)}
          exiting={FadeOutLeft.duration(200)}
        >
          {currentStep.content}
        </Animated.View>
      </ScrollView>

      {/* Footer with Pagination and Next Button */}
      <View className="px-8 pb-12 gap-6 flex flex-row items-center">
        {/* Pagination Dots - ocupan el espacio restante */}
        {showProgress && (
          <View className="flex-1">
            <AtomPaginationDots
              total={totalSteps}
              currentIndex={currentStepIndex}
              activeColor={accentColor}
              inactiveColor={mutedColor}
              maxWidth={undefined}
            />
          </View>
        )}

        {/* Next Button - tamaño fijo */}
        <AtomCircularProgressButton
          onPress={handleNext}
          progress={progress}
          backgroundColor={currentStep?.isValid ? accentColor : mutedColor}
          progressColor={accentColor}
          size={84}
          iconSize={36}
        />
      </View>
    </View>
  );
}
