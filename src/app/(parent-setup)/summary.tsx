import { useHeaderHeight } from '@react-navigation/elements';
import { useRouter } from 'expo-router';
import { useThemeColor } from 'heroui-native';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

import { ButtonAtom } from '@/ui/components/atoms/button.atom';
import { AtomCircularProgressButton } from '@/ui/components/atoms/circular-progress-button.atom';
import { AtomLogoSVG } from '@/ui/components/atoms/logo.atom';
import { AtomPaginationDots } from '@/ui/components/atoms/pagination-dots.atom';
import {
  TypographyParagraph,
  TypographySmall,
  TypographyTitle,
} from '@/ui/components/atoms/typography.atom';

interface SummaryRowProps {
  label: string;
  value: string;
  backgroundColor: string;
}

function SummaryRow({ label, value, backgroundColor }: SummaryRowProps) {
  return (
    <View
      style={{ backgroundColor }}
      className="flex-row justify-between items-center px-4 py-3 rounded-xl mb-2"
    >
      <TypographySmall className="text-muted flex-1 mr-4">
        {label}
      </TypographySmall>
      <TypographyParagraph className="text-foreground font-semibold shrink">
        {value}
      </TypographyParagraph>
    </View>
  );
}

interface SummarySectionProps {
  title: string;
  children: React.ReactNode;
}

function SummarySection({ title, children }: SummarySectionProps) {
  return (
    <View className="mb-6">
      <TypographyTitle className="text-foreground mb-3 text-lg font-semibold">
        {title}
      </TypographyTitle>
      {children}
    </View>
  );
}

export default function SummaryConfirmationScreen() {
  const router = useRouter();
  const headerHeight = useHeaderHeight();
  const { t } = useTranslation();

  const backgroundColor = useThemeColor('background');
  const accentColor = useThemeColor('accent');
  const mutedColor = useThemeColor('muted');
  const cardBgColor = useThemeColor('background-secondary');

  // Mock data - in real implementation this would come from context/store
  const summaryData = {
    parent: {
      name: 'María González',
      relationship: 'Madre',
    },
    child: {
      name: 'Carlos',
      birthDate: '15/03/2020',
      diagnosis: 'Espina bífida L4-L5',
    },
    modules: ['Cateterismos', 'Deposiciones', 'Enemas'],
  };

  const handleBack = () => {
    router.back();
  };

  const handleConfirm = () => {
    // TODO: Save data to database/context
    router.replace('/(tabs)/home');
  };

  return (
    <View className="flex-1">
      <KeyboardAwareScrollView
        className="flex-1"
        contentContainerClassName="px-6"
        contentContainerStyle={{
          paddingTop: headerHeight + 16,
          paddingBottom: 100,
        }}
        bottomOffset={60}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with Logo */}
        <View className="items-center mb-8">
          <AtomLogoSVG width={40} height={50} />
        </View>

        {/* Progress Indicator */}
        <View className="items-center mb-6">
          <AtomPaginationDots
            total={5}
            currentIndex={4}
            activeColor={accentColor}
            inactiveColor={mutedColor}
          />
        </View>

        {/* Title and Description */}
        <TypographyTitle
          i18nKey="parent-setup.summary.title"
          className="text-foreground mb-2 text-center"
        />
        <TypographyParagraph
          i18nKey="parent-setup.summary.description"
          className="text-muted text-center mb-8"
        />

        {/* Parent Info Section */}
        <SummarySection title={t('parent-setup.summary.parent-section')}>
          <SummaryRow
            label={t('parent-setup.summary.parent-name')}
            value={summaryData.parent.name}
            backgroundColor={cardBgColor}
          />
          <SummaryRow
            label={t('parent-setup.summary.parent-relationship')}
            value={summaryData.parent.relationship}
            backgroundColor={cardBgColor}
          />
        </SummarySection>

        {/* Child Info Section */}
        <SummarySection title={t('parent-setup.summary.child-section')}>
          <SummaryRow
            label={t('parent-setup.summary.child-name')}
            value={summaryData.child.name}
            backgroundColor={cardBgColor}
          />
          <SummaryRow
            label={t('parent-setup.summary.child-birth-date')}
            value={summaryData.child.birthDate}
            backgroundColor={cardBgColor}
          />
          <SummaryRow
            label={t('parent-setup.summary.child-diagnosis')}
            value={summaryData.child.diagnosis}
            backgroundColor={cardBgColor}
          />
        </SummarySection>

        {/* Modules Section */}
        <SummarySection title={t('parent-setup.summary.modules-section')}>
          <View
            style={{ backgroundColor: cardBgColor }}
            className="px-4 py-3 rounded-xl"
          >
            {summaryData.modules.map((module, index) => (
              <View
                key={module}
                className={`flex-row items-center ${index < summaryData.modules.length - 1 ? 'mb-2' : ''}`}
              >
                <View
                  style={{ backgroundColor: accentColor }}
                  className="w-1.5 h-1.5 rounded-full mr-3"
                />
                <TypographyParagraph className="text-foreground">
                  {module}
                </TypographyParagraph>
              </View>
            ))}
          </View>
        </SummarySection>
      </KeyboardAwareScrollView>

      {/* Footer with Buttons */}
      <View
        style={{ backgroundColor }}
        className="absolute bottom-0 left-0 right-0 px-6 py-4 border-t border-muted/20"
      >
        <View className="flex-row items-center justify-between">
          <ButtonAtom
            title="next"
            onPress={handleBack}
            className="flex-1 mr-3 bg-surface"
          />
          <AtomCircularProgressButton
            progress={4 / 5}
            onPress={handleConfirm}
            size={60}
            progressColor={accentColor}
            backgroundColor={accentColor}
          />
        </View>
      </View>
    </View>
  );
}
