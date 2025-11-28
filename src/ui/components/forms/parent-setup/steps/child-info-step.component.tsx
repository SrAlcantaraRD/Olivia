import { useThemeColor } from 'heroui-native';
import { TextInput, View } from 'react-native';

import {
  TypographyParagraph,
  TypographySmall,
} from '@/ui/components/atoms/typography.atom';

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
  const foregroundColor = useThemeColor('foreground');
  const mutedColor = useThemeColor('muted');
  const inputBgColor = useThemeColor('background-secondary');

  return (
    <>
      {/* Name Input */}
      <View className="mb-6">
        <TypographyParagraph
          style={{ color: foregroundColor }}
          className="mb-2"
          weight="medium"
          i18nKey="parent-setup.child-info.name-label"
        />
        <TextInput
          value={name}
          onChangeText={onNameChange}
          placeholder="Nombre del niño/a"
          placeholderTextColor={mutedColor}
          style={{
            backgroundColor: inputBgColor,
            color: foregroundColor,
            borderWidth: 1,
            borderColor: mutedColor,
          }}
          className="rounded-2xl px-4 py-3 text-base"
        />
      </View>

      {/* Birth Date Input */}
      <View className="mb-6">
        <TypographyParagraph
          style={{ color: foregroundColor }}
          className="mb-2"
          weight="medium"
          i18nKey="parent-setup.child-info.birth-date-label"
        />
        <TextInput
          value={birthDate}
          onChangeText={onBirthDateChange}
          placeholder="DD / MM / AAAA"
          placeholderTextColor={mutedColor}
          style={{
            backgroundColor: inputBgColor,
            color: foregroundColor,
            borderWidth: 1,
            borderColor: mutedColor,
          }}
          className="rounded-2xl px-4 py-3 text-base"
          keyboardType="numbers-and-punctuation"
        />
      </View>

      {/* Diagnosis Input (Optional) */}
      <View className="mb-6">
        <View className="flex-row items-center mb-2">
          <TypographyParagraph
            style={{ color: foregroundColor }}
            weight="medium"
            i18nKey="parent-setup.child-info.diagnosis-label"
          />
          <TypographySmall style={{ color: mutedColor }} className="ml-2">
            (opcional)
          </TypographySmall>
        </View>
        <TextInput
          value={diagnosis}
          onChangeText={onDiagnosisChange}
          placeholder="Diagnóstico médico"
          placeholderTextColor={mutedColor}
          style={{
            backgroundColor: inputBgColor,
            color: foregroundColor,
            borderWidth: 1,
            borderColor: mutedColor,
          }}
          className="rounded-2xl px-4 py-3 text-base"
        />
      </View>
    </>
  );
}
