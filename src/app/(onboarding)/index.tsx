import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useThemeColor } from 'heroui-native';
import { useState } from 'react';
import { View } from 'react-native';

import {
  TypographyParagraph,
  TypographySubtitle,
} from '@/ui/components/atoms/typography.atom';
import {
  Wizard,
  type WizardStep,
} from '@/ui/components/molecules/wizard.molecule';
import type { Ti18nKeys } from '@/ui/i18n/locales/en-EN';

interface WelcomeSlide {
  illustration: {
    outerIcon?: keyof typeof Ionicons.glyphMap;
    innerIcon: keyof typeof Ionicons.glyphMap;
    innerIconSize?: number;
    innerShape?: 'rounded-full' | 'rounded-3xl';
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
      innerIcon: 'heart',
      innerIconSize: 80,
      innerShape: 'rounded-full',
    },
    title: 'onboarding-screen.slider.care-with-peace.title',
    description: 'onboarding-screen.slider.care-with-peace.description',
  },
  {
    illustration: {
      innerIcon: 'time-outline',
      innerIconSize: 60,
      innerShape: 'rounded-3xl',
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
      innerIcon: 'cloud-outline',
      innerIconSize: 60,
      innerShape: 'rounded-3xl',
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

function WelcomeSlideContent({ slide }: { slide: WelcomeSlide }) {
  const foregroundColor = useThemeColor('foreground');
  const mutedColor = useThemeColor('muted');
  const accentColor = useThemeColor('accent');

  return (
    <View className="flex-1 justify-center items-center">
      {/* Illustration */}
      <View className="bg-[#C8CAE5] rounded-full w-64 h-64 mb-12 items-center justify-center">
        <View
          className={`bg-[#9B9FC5] ${slide.illustration.innerShape} p-8 items-center justify-center`}
        >
          <Ionicons
            name={slide.illustration.innerIcon}
            size={slide.illustration.innerIconSize || 60}
            color="#7B7FA5"
          />
          {slide.illustration.secondaryIcon && (
            <Ionicons
              name={slide.illustration.secondaryIcon.name}
              size={slide.illustration.secondaryIcon.size || 40}
              color="#7B7FA5"
              style={{
                position: 'absolute',
                ...slide.illustration.secondaryIcon.position,
              }}
            />
          )}
        </View>
      </View>

      {/* Title */}
      <TypographySubtitle
        style={{ color: foregroundColor }}
        className={`text-center ${slide.bulletPoints ? 'mb-6' : 'mb-4'}`}
        i18nKey={slide.title}
      />

      {/* Description or Bullet Points */}
      {slide.description && (
        <TypographyParagraph
          style={{ color: mutedColor }}
          className="text-center"
          i18nKey={slide.description}
        />
      )}

      {slide.bulletPoints && (
        <View className="gap-3 w-full mt-4">
          {slide.bulletPoints.map((item) => (
            <View key={item} className="flex-row items-center gap-3">
              <View
                style={{ backgroundColor: accentColor }}
                className="w-1.5 h-1.5 rounded-full"
              />
              <TypographyParagraph
                style={{ color: mutedColor }}
                i18nKey={item}
              />
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

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
    content: <WelcomeSlideContent slide={slide} />,
    isValid: true, // Siempre válido en onboarding
  }));

  return (
    <Wizard
      steps={steps}
      currentStepIndex={currentSlide}
      onNext={handleNext}
      onBack={handleBack}
      onSkip={() => router.push('/(onboarding)/role-selection')}
      showBackButton={true}
      showSkipButton={currentSlide < WELCOME_SLIDES.length - 1}
      showLogo={true}
      showProgress={true}
    />
  );
}
