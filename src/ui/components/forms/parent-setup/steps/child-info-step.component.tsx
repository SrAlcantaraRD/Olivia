import { useState } from 'react';
import { View } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

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
  const [openDatePicker, setOpenDatePicker] = useState(false);

  const parseDate = (dateString: string): Date => {
    if (!dateString) return new Date();
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleDateConfirm = (date: Date) => {
    setOpenDatePicker(false);
    onBirthDateChange(formatDate(date));
  };

  const handleDateCancel = () => {
    setOpenDatePicker(false);
  };

  const showDatePickerModal = () => {
    setOpenDatePicker(true);
  };

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
          onChangeText={() => {}} // No-op since it's read-only
          keyboardType="numbers-and-punctuation"
          isRequired
          testID="child-birthdate-input"
          onPress={showDatePickerModal}
          editable={false}
        />
        <DateTimePickerModal
          isVisible={openDatePicker}
          mode="date"
          date={parseDate(birthDate)}
          maximumDate={new Date()}
          onConfirm={handleDateConfirm}
          onCancel={handleDateCancel}
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
