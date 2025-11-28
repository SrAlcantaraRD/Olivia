import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useThemeColor } from 'heroui-native';
import { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, View } from 'react-native';

import { AtomCircularProgressButton } from '@/ui/components/atoms/circular-progress-button.atom';
import { AtomLogoSVG } from '@/ui/components/atoms/logo.atom';
import { AtomPaginationDots } from '@/ui/components/atoms/pagination-dots.atom';
import {
  TypographyParagraph,
  TypographySmall,
  TypographySubtitle,
} from '@/ui/components/atoms/typography.atom';
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

export default function OnboardingIndex() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const backgroundColor = useThemeColor('background');
  const foregroundColor = useThemeColor('foreground');
  const mutedColor = useThemeColor('muted');
  const accentColor = useThemeColor('accent');

  const isFirstSlide = currentSlide === 0;
  const isLastSlide = currentSlide === WELCOME_SLIDES.length - 1;
  const currentContent = WELCOME_SLIDES[currentSlide];

  // Animate slide changes with slide in effect
  useEffect(() => {
    // Reset position for slide in
    fadeAnim.setValue(0);
    slideAnim.setValue(30);

    // Slide in new content
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [currentSlide, fadeAnim, slideAnim]);

  const handleSkip = () => {
    router.push('/select-role');
  };

  const handleNext = () => {
    if (isLastSlide) {
      router.push('/select-role');
    } else {
      setCurrentSlide((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (isFirstSlide) {
      router.back();
    } else {
      setCurrentSlide((prev) => prev - 1);
    }
  };

  return (
    <View style={{ backgroundColor, flex: 1 }} className="flex-1">
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 pt-12 pb-4">
        {isFirstSlide ? (
          <View className="w-8" />
        ) : (
          <Pressable onPress={handleBack}>
            <Ionicons name="chevron-back" size={24} color={foregroundColor} />
          </Pressable>
        )}
        <AtomLogoSVG width={40} height={40} />
        {!isLastSlide ? (
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
      <View className="flex-1 justify-center items-center px-8">
        {/* Illustration */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
          className="bg-[#C8CAE5] rounded-full w-64 h-64 mb-12 items-center justify-center"
        >
          <View
            className={`bg-[#9B9FC5] ${currentContent.illustration.innerShape} p-8 items-center justify-center`}
          >
            <Ionicons
              name={currentContent.illustration.innerIcon}
              size={currentContent.illustration.innerIconSize || 60}
              color="#7B7FA5"
            />
            {currentContent.illustration.secondaryIcon && (
              <Ionicons
                name={currentContent.illustration.secondaryIcon.name}
                size={currentContent.illustration.secondaryIcon.size || 40}
                color="#7B7FA5"
                style={{
                  position: 'absolute',
                  ...currentContent.illustration.secondaryIcon.position,
                }}
              />
            )}
          </View>
        </Animated.View>

        {/* Content Container with Fixed Height */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
          className="h-48 justify-start w-full"
        >
          {/* Title */}
          <TypographySubtitle
            style={{ color: foregroundColor }}
            className={`text-center ${currentContent.bulletPoints ? 'mb-6' : 'mb-4'}`}
            i18nKey={currentContent.title}
          />

          {/* Description or Bullet Points */}
          {currentContent.description && (
            <TypographyParagraph
              style={{ color: mutedColor }}
              className="text-center"
              i18nKey={currentContent.description}
            />
          )}

          {currentContent.bulletPoints && (
            <View className="gap-3 w-full">
              {currentContent.bulletPoints.map((item) => (
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
        </Animated.View>
      </View>

      {/* Footer with Pagination and Next Button */}
      <View className="px-8 pb-12 gap-6 flex flex-row items-center justify-between">
        {/* Pagination Dots */}
        <AtomPaginationDots
          total={WELCOME_SLIDES.length}
          currentIndex={currentSlide}
          activeColor={accentColor}
          inactiveColor={mutedColor}
          keys={WELCOME_SLIDES.map((slide) => slide.title)}
        />

        {/* Next/Finish Button */}
        <AtomCircularProgressButton
          onPress={handleNext}
          progress={(currentSlide + 1) / WELCOME_SLIDES.length}
          backgroundColor={accentColor}
          progressColor={accentColor}
          size={84}
          iconSize={36}
        />
      </View>
    </View>
  );
}
