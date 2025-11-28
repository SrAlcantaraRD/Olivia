import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from 'heroui-native';
import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';

import { AtomCircularProgressButton } from '@/ui/components/atoms/circular-progress-button.atom';
import { AtomLogoSVG } from '@/ui/components/atoms/logo.atom';
import { AtomPaginationDots } from '@/ui/components/atoms/pagination-dots.atom';
import {
  TypographyParagraph,
  TypographyTitle,
} from '@/ui/components/atoms/typography.atom';
import type { Ti18nKeys } from '@/ui/i18n/locales/en-EN';

export interface FormWizardStep {
  id: string;
  titleKey: Ti18nKeys;
  descriptionKey?: Ti18nKeys;
  content: ReactNode;
  isValid: boolean;
}

interface FormWizardProps {
  steps: FormWizardStep[];
  currentStepIndex: number;
  totalSteps?: number;
  onNext: () => void;
  onBack: () => void;
  showBackButton?: boolean;
  showLogo?: boolean;
  showProgress?: boolean;
}

export function FormWizard({
  steps,
  currentStepIndex,
  totalSteps: totalStepsProp,
  onNext,
  onBack,
  showBackButton = true,
  showLogo = true,
  showProgress = true,
}: FormWizardProps) {
  const backgroundColor = useThemeColor('background');
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

  return (
    <View style={{ backgroundColor, flex: 1 }}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 pt-12 pb-4">
        {showBackButton ? (
          <Pressable onPress={handleBack}>
            <Ionicons name="chevron-back" size={24} color={foregroundColor} />
          </Pressable>
        ) : (
          <View className="w-8" />
        )}
        {showLogo && <AtomLogoSVG width={40} height={40} />}
        {!showLogo && <View className="w-8" />}
        <View className="w-8" />
      </View>

      {/* Content with Keyboard Awareness */}
      <KeyboardAwareScrollView
        className="flex-1"
        contentContainerClassName="px-6"
        contentContainerStyle={{
          paddingTop: 0,
          paddingBottom: 140,
        }}
        bottomOffset={60}
        showsVerticalScrollIndicator={false}
      >
        {/* Title and Description */}
        <Animated.View
          key={`header-${currentStepIndex}`}
          entering={FadeInRight.duration(250)}
          exiting={FadeOutLeft.duration(200)}
          className="mb-8"
        >
          <TypographyTitle
            style={{ color: foregroundColor }}
            className="mb-2"
            i18nKey={currentStep.titleKey}
          />
          {currentStep.descriptionKey && (
            <TypographyParagraph
              style={{ color: mutedColor }}
              i18nKey={currentStep.descriptionKey}
            />
          )}
        </Animated.View>

        {/* Step Content */}
        <Animated.View
          key={`content-${currentStepIndex}`}
          entering={FadeInRight.duration(250)}
          exiting={FadeOutLeft.duration(200)}
        >
          {currentStep.content}
        </Animated.View>
      </KeyboardAwareScrollView>

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
