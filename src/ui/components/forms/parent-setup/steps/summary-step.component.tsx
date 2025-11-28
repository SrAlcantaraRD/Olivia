import { useThemeColor } from 'heroui-native';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import {
  TypographyParagraph,
  TypographySmall,
  TypographyTitle,
} from '@/ui/components/atoms/typography.atom';
import type { ParentSetupFormData } from '../types';
import { MODULE_IDS } from '../types';

interface SummaryStepProps {
  formData: ParentSetupFormData;
}

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

export function SummaryStep({ formData }: SummaryStepProps) {
  const { t } = useTranslation();
  const cardBgColor = useThemeColor('background-secondary');
  const accentColor = useThemeColor('accent');

  // Map module IDs to translated names
  const getModuleName = (moduleId: string): string => {
    switch (moduleId) {
      case MODULE_IDS.CATHETERIZATION:
        return t('parent-setup.modules.catheterization.title');
      case MODULE_IDS.BOWEL_MOVEMENTS:
        return t('parent-setup.modules.bowel-movements.title');
      case MODULE_IDS.ENEMAS:
        return t('parent-setup.modules.enemas.title');
      default:
        return moduleId;
    }
  };

  // Map relationship to translated text
  const getRelationshipText = (
    relationship: 'parent' | 'guardian' | null
  ): string => {
    if (relationship === 'parent') return t('parent-setup.parent-info.parent');
    if (relationship === 'guardian')
      return t('parent-setup.parent-info.guardian');
    return '-';
  };

  const moduleNames = Array.from(formData.selectedModules).map(getModuleName);

  return (
    <>
      {/* Parent Info Section */}
      <SummarySection title={t('parent-setup.summary.parent-section')}>
        <SummaryRow
          label={t('parent-setup.summary.parent-name')}
          value={formData.parentName || '-'}
          backgroundColor={cardBgColor}
        />
        <SummaryRow
          label={t('parent-setup.summary.parent-relationship')}
          value={getRelationshipText(formData.relationship)}
          backgroundColor={cardBgColor}
        />
      </SummarySection>

      {/* Child Info Section */}
      <SummarySection title={t('parent-setup.summary.child-section')}>
        <SummaryRow
          label={t('parent-setup.summary.child-name')}
          value={formData.childName || '-'}
          backgroundColor={cardBgColor}
        />
        <SummaryRow
          label={t('parent-setup.summary.child-birth-date')}
          value={formData.birthDate || '-'}
          backgroundColor={cardBgColor}
        />
        {formData.diagnosis && (
          <SummaryRow
            label={t('parent-setup.summary.child-diagnosis')}
            value={formData.diagnosis}
            backgroundColor={cardBgColor}
          />
        )}
      </SummarySection>

      {/* Modules Section */}
      <SummarySection title={t('parent-setup.summary.modules-section')}>
        <View
          style={{ backgroundColor: cardBgColor }}
          className="px-4 py-3 rounded-xl"
        >
          {moduleNames.length > 0 ? (
            moduleNames.map((moduleName, index) => (
              <View
                key={moduleName}
                className={`flex-row items-center ${index < moduleNames.length - 1 ? 'mb-2' : ''}`}
              >
                <View
                  style={{ backgroundColor: accentColor }}
                  className="w-1.5 h-1.5 rounded-full mr-3"
                />
                <TypographyParagraph className="text-foreground">
                  {moduleName}
                </TypographyParagraph>
              </View>
            ))
          ) : (
            <TypographyParagraph className="text-muted">
              {t('parent-setup.summary.no-modules')}
            </TypographyParagraph>
          )}
        </View>
      </SummarySection>
    </>
  );
}
