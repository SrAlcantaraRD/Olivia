import { useState } from 'react';

import { useAdapters } from '@/adapter';
import type { IconName } from '@/ui/components/atoms/icon.atom';
import { ScreenLayout } from '@/ui/components/layouts/screen.layout';
import { WelcomeSlideContent } from '@/ui/components/molecules/welcome-slide-content.molecule';
import {
  Wizard,
  type WizardStep,
} from '@/ui/components/molecules/wizard.molecule';
import { useNavigation } from '@/ui/hook/use-navigation.hook';
import type { Ti18nKeys } from '@/ui/i18n/locales/en-EN';

interface WelcomeSlide {
  illustration: {
    icon: IconName;
    iconSize?: number;
    shape?: 'rounded-full' | 'rounded-lg';
    secondaryIcon?: {
      name: IconName;
      size?: number;
      position?: { bottom?: number; right?: number };
    };
  };
  title: Ti18nKeys;
  description?: Ti18nKeys;
  bulletPoints?: Ti18nKeys[];
}

const WELCOME_SLIDES: WelcomeSlide[] = [
  {
    illustration: {
      icon: 'heart',
      iconSize: 80,
      shape: 'rounded-full',
    },
    title: 'onboarding-screen.slider.care-with-peace.title',
    description: 'onboarding-screen.slider.care-with-peace.description',
  },
  {
    illustration: {
      icon: 'time-outline',
      iconSize: 60,
      shape: 'rounded-lg',
      secondaryIcon: {
        name: 'checkmark-done-outline',
        size: 40,
        position: { bottom: 10, right: 10 },
      },
    },
    title: 'onboarding-screen.slider.slogan.title',
    bulletPoints: [
      'onboarding-screen.slider.slogan.bullet.record-in-seconds',
      'onboarding-screen.slider.slogan.bullet.one-step-at-a-time',
      'onboarding-screen.slider.slogan.bullet.perfect-for-busy-routines',
    ],
  },
  {
    illustration: {
      icon: 'cloud-outline',
      iconSize: 60,
      shape: 'rounded-lg',
      secondaryIcon: {
        name: 'lock-closed',
        size: 40,
        position: { bottom: 15, right: 15 },
      },
    },
    title: 'onboarding-screen.slider.data-control.title',
    description: 'onboarding-screen.slider.data-control.description',
  },
];

export default function OnboardingIndex() {
  const { navigationAdapter } = useAdapters();
  const { goToRoleSelection, goBack: navigateBack } = useNavigation({
    navigationAdapter,
  });
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide === WELCOME_SLIDES.length - 1) {
      goToRoleSelection();
    } else {
      setCurrentSlide((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentSlide === 0) {
      navigateBack();
    } else {
      setCurrentSlide((prev) => prev - 1);
    }
  };

  const steps: WizardStep[] = WELCOME_SLIDES.map((slide) => ({
    id: slide.title,
    content: (
      <WelcomeSlideContent
        illustration={slide.illustration}
        title={slide.title}
        description={slide.description}
        bulletPoints={slide.bulletPoints}
      />
    ),
    isValid: true,
  }));

  return (
    <ScreenLayout testID="onboarding-screen">
      <Wizard
        testID="onboarding-wizard"
        steps={steps}
        currentStepIndex={currentSlide}
        onNext={handleNext}
        onBack={handleBack}
        onSkip={goToRoleSelection}
        showBackButton={true}
        showSkipButton={true}
      />
    </ScreenLayout>
  );
}
