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
      <View className="mb-6">
        <TextFieldAtom
          label="parent-setup.child-info.name-label"
          placeholder="parent-setup.child-info.name-placeholder"
          value={name}
          onChangeText={onNameChange}
          isRequired
        />
      </View>

      {/* Birth Date Input */}
      <View className="mb-6">
        <TextFieldAtom
          label="parent-setup.child-info.birth-date-label"
          placeholder="parent-setup.child-info.birth-date-placeholder"
          value={birthDate}
          onChangeText={onBirthDateChange}
          keyboardType="numbers-and-punctuation"
          isRequired
        />
      </View>

      {/* Diagnosis Input (Optional) */}
      <View className="mb-6">
        <TextFieldAtom
          label="parent-setup.child-info.diagnosis-label"
          placeholder="parent-setup.child-info.diagnosis-placeholder"
          value={diagnosis}
          onChangeText={onDiagnosisChange}
        />
        <TypographySmall
          className="text-muted ml-1 mt-1"
          i18nKey="parent-setup.child-info.diagnosis-hint"
          variant="light"
        />
      </View>
    </>
  );
}
