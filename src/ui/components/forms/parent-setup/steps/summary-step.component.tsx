import { useThemeColor } from 'heroui-native';
import { View } from 'react-native';

import {
  TypographyHeading,
  TypographyParagraph,
  TypographySmall,
} from '@/ui/components/atoms/typography.atom';
import type { Ti18nKeys } from '@/ui/i18n/locales/en-EN';
import type { ParentSetupFormData } from '../types';
import { MODULE_IDS } from '../types';

interface SummaryStepProps {
  formData: ParentSetupFormData;
}

interface SummaryRowProps {
  label: Ti18nKeys;
  value: string;
  backgroundColor: string;
}

function SummaryRow({ label, value, backgroundColor }: SummaryRowProps) {
  const foregroundColor = useThemeColor('foreground');
  const mutedColor = useThemeColor('muted');

  return (
    <View
      style={{ backgroundColor }}
      className="flex-row justify-between items-center px-4 py-3 rounded-xl mb-2"
    >
      <TypographySmall
        style={{ color: mutedColor }}
        className="flex-1 mr-4"
        variant="light"
        i18nKey={label}
      />
      <TypographyParagraph
        style={{ color: foregroundColor }}
        className="shrink"
        weight="semibold"
      >
        {value}
      </TypographyParagraph>
    </View>
  );
}

interface SummarySectionProps {
  title: Ti18nKeys;
  children: React.ReactNode;
}

function SummarySection({ title, children }: SummarySectionProps) {
  const foregroundColor = useThemeColor('foreground');

  return (
    <View>
      <TypographyHeading
        style={{ color: foregroundColor }}
        size="lg"
        i18nKey={title}
      />
      {children}
    </View>
  );
}

export function SummaryStep({ formData }: SummaryStepProps) {
  const cardBgColor = useThemeColor('background-secondary');
  const accentColor = useThemeColor('accent');
  const foregroundColor = useThemeColor('foreground');
  const mutedColor = useThemeColor('muted');

  // Map module IDs to translated names
  const getModuleName = (moduleId: string): Ti18nKeys => {
    switch (moduleId) {
      case MODULE_IDS.CATHETERIZATION:
        return 'parent-setup.modules.catheterization.title';
      case MODULE_IDS.BOWEL_MOVEMENTS:
        return 'parent-setup.modules.bowel-movements.title';
      case MODULE_IDS.ENEMAS:
        return 'parent-setup.modules.enemas.title';
      default:
        throw new Error(`Unknown module ID: ${moduleId}`);
    }
  };

  // Map relationship to translated text
  const getRelationshipText = (
    relationship: 'parent' | 'guardian' | null
  ): Ti18nKeys => {
    if (relationship === 'parent') return 'parent-setup.parent-info.parent';
    if (relationship === 'guardian') return 'parent-setup.parent-info.guardian';

    throw new Error(`Unknown relationship: "${relationship}"`);
  };

  const moduleNames = Array.from(formData.selectedModules).map(getModuleName);

  return (
    <>
      {/* Parent Info Section */}
      <SummarySection title="parent-setup.summary.parent-section">
        <SummaryRow
          label="parent-setup.summary.parent-name"
          value={formData.parentName}
          backgroundColor={cardBgColor}
        />
        <SummaryRow
          label="parent-setup.summary.parent-relationship"
          value={getRelationshipText(formData.relationship)}
          backgroundColor={cardBgColor}
        />
      </SummarySection>

      {/* Child Info Section */}
      <SummarySection title="parent-setup.summary.child-section">
        <SummaryRow
          label="parent-setup.summary.child-name"
          value={formData.childName}
          backgroundColor={cardBgColor}
        />
        <SummaryRow
          label="parent-setup.summary.child-birth-date"
          value={formData.birthDate}
          backgroundColor={cardBgColor}
        />
        {formData.diagnosis && (
          <SummaryRow
            label="parent-setup.summary.child-diagnosis"
            value={formData.diagnosis}
            backgroundColor={cardBgColor}
          />
        )}
      </SummarySection>

      {/* Modules Section */}
      <SummarySection title="parent-setup.summary.modules-section">
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
                <TypographyParagraph
                  style={{ color: foregroundColor }}
                  i18nKey={moduleName}
                />
              </View>
            ))
          ) : (
            <TypographyParagraph
              style={{ color: mutedColor }}
              i18nKey="parent-setup.summary.no-modules"
              variant="light"
            />
          )}
        </View>
      </SummarySection>
    </>
  );
}
