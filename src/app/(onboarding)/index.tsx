import type { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';

import { WelcomeSlideContent } from '@/ui/components/molecules/welcome-slide-content.molecule';
import {
  Wizard,
  type WizardStep,
} from '@/ui/components/molecules/wizard.molecule';
import type { Ti18nKeys } from '@/ui/i18n/locales/en-EN';

interface WelcomeSlide {
  illustration: {
    icon: keyof typeof Ionicons.glyphMap;
    iconSize?: number;
    shape?: 'rounded-full' | 'rounded-3xl';
    secondaryIcon?: {
      name: keyof typeof Ionicons.glyphMap;
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
      shape: 'rounded-3xl',
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
      shape: 'rounded-3xl',
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
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide === WELCOME_SLIDES.length - 1) {
      router.push('/(onboarding)/role-selection');
    } else {
      setCurrentSlide((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentSlide === 0) {
      router.back();
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
    <Wizard
      steps={steps}
      currentStepIndex={currentSlide}
      onNext={handleNext}
      onBack={handleBack}
      onSkip={() => router.push('/(onboarding)/role-selection')}
      showBackButton={true}
      showSkipButton={true}
    />
  );
}
