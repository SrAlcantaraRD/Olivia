import { useMemo } from 'react';
import { View } from 'react-native';

import type { TModule } from '@/domain/module/entity/module.entity';
import type { TRecordCreate } from '@/domain/module/entity/record.entity';
import { MODULE_FIELD_TYPE_ENUM } from '@/domain/module/enum/module-field-type.enum';
import { TextFieldAtom } from '@/ui/components/atoms/text-field.atom';
import { TypographyParagraph } from '@/ui/components/atoms/typography.atom';
import { CardWithDetails } from '@/ui/components/molecules/card-with-details.molecule';
import { FormPage } from '@/ui/components/molecules/form-page.molecule';
import { Wizard } from '@/ui/components/molecules/wizard.molecule';
import useModuleWizard from '@/ui/components/organisms/module-wizard/use-module-wizard.hook';
import type { Ti18nKeys } from '@/ui/i18n/locales/en-EN';

interface ModuleWizardProps {
  module: TModule;
  onComplete: (data: TRecordCreate) => void;
  testID: string;
}

export function parseFieldValues(valuesStr: string | undefined): string[] {
  if (!valuesStr || valuesStr.length === 0) return [];
  try {
    const parsed = JSON.parse(valuesStr);
    if (Array.isArray(parsed)) return parsed.map((v) => String(v));
    return [String(parsed)];
  } catch (err) {
    // fallback to comma separated list
    return valuesStr
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean);
  }
}

export function ModuleWizard({
  module,
  onComplete,
  testID,
}: ModuleWizardProps) {
  const {
    currentStep,
    steps,
    values,
    goToNextStep,
    goToPreviousStep,
    setFieldValue,
    selectOptionAndNext,
  } = useModuleWizard({ module });

  const handleNext = () => {
    const lastIndex = wizardSteps.length - 1;
    if (currentStep >= lastIndex) {
      onComplete(values);
    } else {
      goToNextStep();
    }
  };

  const wizardSteps = useMemo(
    () =>
      steps.map((s) => ({
        id: s.id,
        content: (
          <FormPage
            key={`page-${s.id}`}
            step={{
              id: s.id,
              titleKey: s.titleKey as Ti18nKeys,
              descriptionKey: s.descriptionKey as Ti18nKeys,
              content: (
                <View className="mt-4">
                  {s.field.type === MODULE_FIELD_TYPE_ENUM.SELECT && (
                    <View>
                      {parseFieldValues(s.field.values || '').map((option) => (
                        <CardWithDetails
                          key={`option-${option}`}
                          icon="mic-circle"
                          titleKey={option as Ti18nKeys}
                          isSelected={values[s.field.id] === option}
                          onSelect={() =>
                            selectOptionAndNext(s.field.id, option)
                          }
                          testID={`${testID}.field.${s.field.id}.option.${option}`}
                        />
                      ))}
                    </View>
                  )}

                  {s.field.type === MODULE_FIELD_TYPE_ENUM.TEXT && (
                    <TextFieldAtom
                      label={s.field.title as Ti18nKeys}
                      placeholder={s.field.description as Ti18nKeys}
                      value={values[s.field.id] ?? ''}
                      onChangeText={(text) => setFieldValue(s.field.id, text)}
                    />
                  )}

                  {s.field.type !== MODULE_FIELD_TYPE_ENUM.TEXT &&
                    s.field.type !== MODULE_FIELD_TYPE_ENUM.SELECT && (
                      <TypographyParagraph i18nKey="component.register_stool_button.description" />
                    )}
                </View>
              ),
              isValid: s.isValid,
            }}
          />
        ),
        isValid: s.isValid,
      })),
    []
  );

  return (
    <Wizard
      steps={wizardSteps}
      currentStepIndex={currentStep}
      onNext={handleNext}
      onBack={goToPreviousStep}
      showBackButton={true}
      testID={testID}
    />
  );
}
