import { useThemeColor } from 'heroui-native';
import type { ReactNode } from 'react';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';

import {
  TypographyParagraph,
  TypographyTitle,
} from '@/ui/components/atoms/typography.atom';
import type { Ti18nKeys } from '@/ui/i18n/locales/en-EN';

export interface FormPageStep {
  id: string;
  titleKey: Ti18nKeys;
  descriptionKey?: Ti18nKeys;
  content: ReactNode;
  isValid: boolean;
}

interface FormPageProps {
  step: FormPageStep;
  testID: string;
}

export function FormPage({ step, testID }: FormPageProps) {
  const foregroundColor = useThemeColor('foreground');
  const mutedColor = useThemeColor('muted');

  return (
    <>
      {/* Title and Description */}
      <Animated.View
        key={`header-${step.id}`}
        entering={FadeInRight.duration(250)}
        exiting={FadeOutLeft.duration(200)}
        className="mb-8"
      >
        <TypographyTitle
          style={{ color: foregroundColor }}
          testID={`${testID}.title`}
          className="mb-2"
          i18nKey={step.titleKey}
        />
        {step.descriptionKey && (
          <TypographyParagraph
            testID={`${testID}.description`}
            style={{ color: mutedColor }}
            i18nKey={step.descriptionKey}
          />
        )}
      </Animated.View>

      {/* Step Content */}
      {step.content}
    </>
  );
}
