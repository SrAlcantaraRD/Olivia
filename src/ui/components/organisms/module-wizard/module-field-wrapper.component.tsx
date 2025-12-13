import type { FC } from 'react';
import { View } from 'react-native';

import { MODULE_FIELD_TYPE_ENUM } from '@/domain/module/enum/module-field-type.enum';
import { TextFieldAtom } from '@/ui/components/atoms/text-field.atom';
import { TypographyParagraph } from '@/ui/components/atoms/typography.atom';
import { CardWithDetails } from '@/ui/components/molecules/card-with-details.molecule';

function parseFieldValues(valuesStr: string | undefined): string[] {
  if (!valuesStr || valuesStr.length === 0) return [];
  try {
    const parsed = JSON.parse(valuesStr);
    if (Array.isArray(parsed)) return parsed.map((v) => String(v));
    return [String(parsed)];
  } catch (_err) {
    return valuesStr
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean);
  }
}

import type { Ti18nKeys } from '@/ui/i18n/locales/en-EN';

interface FieldStep {
  id: string;
  titleKey: Ti18nKeys;
  descriptionKey: Ti18nKeys;
  field: {
    id: number;
    title: string;
    description: string;
    type: string;
    values: string | null;
  };
  isValid: boolean;
}

interface ModuleFieldWrapperProps {
  step: FieldStep;
  values: Record<number, string>;
  setFieldValue: (fieldId: number, value: string) => void;
  selectOptionAndNext: (fieldId: number, value: string) => void;
  testID: string;
}

export const ModuleFieldWrapper: FC<ModuleFieldWrapperProps> = ({
  step,
  values,
  setFieldValue,
  selectOptionAndNext,
  testID,
}) => {
  const field = step.field;

  if (field.type === MODULE_FIELD_TYPE_ENUM.SELECT) {
    const options = parseFieldValues(field.values || '');
    return (
      <View className="flex-col gap-4">
        {options.map((option) => (
          <CardWithDetails
            key={`option-${option}`}
            icon="mic-circle"
            title={option as unknown as Ti18nKeys}
            isSelected={values[field.id] === option}
            onPress={() => selectOptionAndNext(field.id, option)}
            testID={`${testID}.field.${field.id}.option.${option}`}
          />
        ))}
      </View>
    );
  }

  if (field.type === MODULE_FIELD_TYPE_ENUM.TEXT) {
    return (
      <TextFieldAtom
        label={step.titleKey}
        placeholder={step.descriptionKey}
        value={values[field.id] ?? ''}
        onChangeText={(text) => setFieldValue(field.id, text)}
      />
    );
  }

  return (
    <TypographyParagraph
      testID={`${testID}.field.${field.title}.unsupported`}
      i18nKey="component.register_stool_button.description"
    />
  );
};
