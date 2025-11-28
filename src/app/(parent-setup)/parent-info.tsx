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
  TypographyTitle,
} from '@/ui/components/atoms/typography.atom';

type Relationship = 'parent' | 'guardian' | null;

interface RelationshipCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  isSelected: boolean;
  onSelect: () => void;
  accentColor: string;
  foregroundColor: string;
  mutedColor: string;
  cardBgColor: string;
}

function RelationshipCard({
  icon,
  label,
  isSelected,
  onSelect,
  accentColor,
  foregroundColor,
  mutedColor,
  cardBgColor,
}: RelationshipCardProps) {
  return (
    <Pressable
      onPress={onSelect}
      style={{
        backgroundColor: cardBgColor,
        borderWidth: 2,
        borderColor: isSelected ? accentColor : 'transparent',
        flex: 1,
      }}
      className="rounded-3xl p-4 items-center"
    >
      <View
        style={{ backgroundColor: accentColor }}
        className="rounded-2xl p-4 w-16 h-16 items-center justify-center mb-3"
      >
        <Ionicons name={icon} size={32} color="white" />
      </View>

      <TypographyParagraph
        style={{ color: foregroundColor }}
        className="text-center"
        weight="medium"
      >
        {label}
      </TypographyParagraph>

      <View
        style={{
          borderWidth: 2,
          borderColor: isSelected ? accentColor : mutedColor,
          backgroundColor: isSelected ? accentColor : 'transparent',
          marginTop: 8,
        }}
        className="w-6 h-6 rounded-full items-center justify-center"
      >
        {isSelected && <Ionicons name="checkmark" size={16} color="white" />}
      </View>
    </Pressable>
  );
}

export default function ParentInfoScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState<Relationship>(null);

  const backgroundColor = useThemeColor('background');
  const foregroundColor = useThemeColor('foreground');
  const mutedColor = useThemeColor('muted');
  const accentColor = useThemeColor('accent');
  const cardBgColor = useThemeColor('surface');
  const inputBgColor = useThemeColor('background-secondary');

  const isValid = name.trim().length > 0 && relationship !== null;

  const handleNext = () => {
    if (isValid) {
      router.push('/(parent-setup)/child-info');
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
          currentIndex={0}
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
            i18nKey="parent-setup.parent-info.title"
          />
          <TypographyParagraph
            style={{ color: mutedColor }}
            i18nKey="parent-setup.parent-info.description"
          />
        </View>

        {/* Name Input */}
        <View className="mb-6">
          <TypographyParagraph
            style={{ color: foregroundColor }}
            className="mb-2"
            weight="medium"
            i18nKey="parent-setup.parent-info.name-label"
          />
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Tu nombre"
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

        {/* Relationship Selection */}
        <View className="mb-6">
          <TypographyParagraph
            style={{ color: foregroundColor }}
            className="mb-3"
            weight="medium"
            i18nKey="parent-setup.parent-info.relationship-label"
          />
          <View className="flex-row gap-4">
            <RelationshipCard
              icon="heart"
              label="Padre / Madre"
              isSelected={relationship === 'parent'}
              onSelect={() => setRelationship('parent')}
              accentColor={accentColor}
              foregroundColor={foregroundColor}
              mutedColor={mutedColor}
              cardBgColor={cardBgColor}
            />
            <RelationshipCard
              icon="shield"
              label="Tutor"
              isSelected={relationship === 'guardian'}
              onSelect={() => setRelationship('guardian')}
              accentColor={accentColor}
              foregroundColor={foregroundColor}
              mutedColor={mutedColor}
              cardBgColor={cardBgColor}
            />
          </View>
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
          progress={1 / 5}
          backgroundColor={isValid ? accentColor : mutedColor}
          progressColor={accentColor}
          size={84}
          iconSize={36}
        />
      </View>
    </View>
  );
}
