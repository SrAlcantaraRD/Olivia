import { View } from 'react-native';

import { TextFieldAtom } from '@/ui/components/atoms/text-field.atom';
import { TypographySmall } from '@/ui/components/atoms/typography.atom';

interface ChildInfoStepProps {
  name: string;
  birthDate: string;
  diagnosis: string;
  onNameChange: (name: string) => void;
  onBirthDateChange: (date: string) => void;
  onDiagnosisChange: (diagnosis: string) => void;
}

export function ChildInfoStep({
  name,
  birthDate,
  diagnosis,
  onNameChange,
  onBirthDateChange,
  onDiagnosisChange,
}: ChildInfoStepProps) {
  return (
    <>
      {/* Name Input */}
      <View className="mb-6" testID="child-name-input">
        <TextFieldAtom
          label="parent-setup.child-info.name-label"
          placeholder="parent-setup.child-info.name-placeholder"
          value={name}
          onChangeText={onNameChange}
          isRequired
          testID="child-name-input"
        />
      </View>

      {/* Birth Date Input */}
      <View className="mb-6" testID="child-birthdate-input">
        <TextFieldAtom
          label="parent-setup.child-info.birth-date-label"
          placeholder="parent-setup.child-info.birth-date-placeholder"
          value={birthDate}
          onChangeText={onBirthDateChange}
          keyboardType="numbers-and-punctuation"
          isRequired
          testID="child-birthdate-input"
        />
      </View>

      {/* Diagnosis Input (Optional) */}
      <View className="mb-6" testID="child-diagnosis-input">
        <TextFieldAtom
          label="parent-setup.child-info.diagnosis-label"
          placeholder="parent-setup.child-info.diagnosis-placeholder"
          value={diagnosis}
          onChangeText={onDiagnosisChange}
          testID="child-diagnosis-input"
        />
        <TypographySmall
          className="text-muted ml-1 mt-1"
          i18nKey="parent-setup.child-info.diagnosis-hint"
          variant="light"
          testID="screen.parent-setup.child-info.diagnosis_hint"
        />
      </View>
    </>
  );
}
