import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useThemeColor } from 'heroui-native';
import { useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';

import { AtomCircularProgressButton } from '@/ui/components/atoms/circular-progress-button.atom';
import { AtomLogoSVG } from '@/ui/components/atoms/logo.atom';
import { AtomPaginationDots } from '@/ui/components/atoms/pagination-dots.atom';
import {
  TypographyParagraph,
  TypographySmall,
  TypographyTitle,
} from '@/ui/components/atoms/typography.atom';

export default function ChildInfoScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [diagnosis, setDiagnosis] = useState('');

  const backgroundColor = useThemeColor('background');
  const foregroundColor = useThemeColor('foreground');
  const mutedColor = useThemeColor('muted');
  const accentColor = useThemeColor('accent');
  const cardBgColor = useThemeColor('surface');
  const inputBgColor = useThemeColor('background-secondary');

  const isValid = name.trim().length > 0 && birthDate.trim().length > 0;

  const handleNext = () => {
    if (isValid) {
      router.push('/(parent-setup)/modules');
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <View style={{ backgroundColor, flex: 1 }} className="flex-1">
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 pt-12 pb-4">
        <Pressable onPress={handleBack}>
          <Ionicons name="chevron-back" size={24} color={foregroundColor} />
        </Pressable>
        <AtomLogoSVG width={40} height={40} />
        <View className="w-8" />
      </View>

      {/* Progress indicator */}
      <View className="px-6 mb-6">
        <AtomPaginationDots
          total={5}
          currentIndex={1}
          activeColor={accentColor}
          inactiveColor={mutedColor}
        />
      </View>

      {/* Content */}
      <View className="flex-1 px-6">
        {/* Title */}
        <View className="mb-8">
          <TypographyTitle
            style={{ color: foregroundColor }}
            className="mb-2"
            i18nKey="parent-setup.child-info.title"
          />
          <TypographyParagraph
            style={{ color: mutedColor }}
            i18nKey="parent-setup.child-info.description"
          />
        </View>

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
            onChangeText={setName}
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
            onChangeText={setBirthDate}
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
            onChangeText={setDiagnosis}
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
      </View>

      {/* Footer */}
      <View className="px-6 pb-12 gap-6 flex flex-row items-center justify-between">
        <Pressable
          onPress={handleBack}
          style={{ backgroundColor: cardBgColor }}
          className="rounded-full p-4 w-14 h-14 items-center justify-center"
        >
          <Ionicons name="chevron-back" size={24} color={foregroundColor} />
        </Pressable>

        <AtomCircularProgressButton
          onPress={handleNext}
          progress={2 / 5}
          backgroundColor={isValid ? accentColor : mutedColor}
          progressColor={accentColor}
          size={84}
          iconSize={36}
        />
      </View>
    </View>
  );
}
