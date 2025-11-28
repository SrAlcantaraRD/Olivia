import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useThemeColor } from 'heroui-native';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { AtomCircularProgressButton } from '@/ui/components/atoms/circular-progress-button.atom';
import { AtomLogoSVG } from '@/ui/components/atoms/logo.atom';
import { AtomPaginationDots } from '@/ui/components/atoms/pagination-dots.atom';
import {
  TypographyParagraph,
  TypographyTitle,
} from '@/ui/components/atoms/typography.atom';
import type { Ti18nKeys } from '@/ui/i18n/locales/en-EN';

interface ModuleCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  titleKey: Ti18nKeys;
  descriptionKey: Ti18nKeys;
  isSelected: boolean;
  onToggle: () => void;
  accentColor: string;
  foregroundColor: string;
  mutedColor: string;
  cardBgColor: string;
}

function ModuleCard({
  icon,
  titleKey,
  descriptionKey,
  isSelected,
  onToggle,
  accentColor,
  foregroundColor,
  mutedColor,
  cardBgColor,
}: ModuleCardProps) {
  return (
    <Pressable
      onPress={onToggle}
      style={{
        backgroundColor: cardBgColor,
        borderWidth: 2,
        borderColor: isSelected ? accentColor : 'transparent',
      }}
      className="rounded-3xl p-4 mb-4"
    >
      <View className="flex-row items-start gap-4">
        <View
          style={{
            borderWidth: 2,
            borderColor: isSelected ? accentColor : mutedColor,
            backgroundColor: isSelected ? accentColor : 'transparent',
          }}
          className="w-6 h-6 rounded items-center justify-center mt-1"
        >
          {isSelected && <Ionicons name="checkmark" size={16} color="white" />}
        </View>

        <View
          style={{ backgroundColor: accentColor }}
          className="rounded-2xl p-3 w-12 h-12 items-center justify-center"
        >
          <Ionicons name={icon} size={24} color="white" />
        </View>

        <View className="flex-1">
          <TypographyTitle
            style={{ color: foregroundColor }}
            className="mb-1"
            size="lg"
            i18nKey={titleKey}
          />
          <TypographyParagraph
            style={{ color: mutedColor }}
            size="sm"
            i18nKey={descriptionKey}
          />
        </View>
      </View>
    </Pressable>
  );
}

export default function ModuleSelectionScreen() {
  const router = useRouter();
  const [selectedModules, setSelectedModules] = useState<Set<string>>(
    new Set()
  );

  const backgroundColor = useThemeColor('background');
  const foregroundColor = useThemeColor('foreground');
  const mutedColor = useThemeColor('muted');
  const accentColor = useThemeColor('accent');
  const cardBgColor = useThemeColor('surface');

  const isValid = selectedModules.size > 0;

  const toggleModule = (moduleId: string) => {
    setSelectedModules((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(moduleId)) {
        newSet.delete(moduleId);
      } else {
        newSet.add(moduleId);
      }
      return newSet;
    });
  };

  const handleNext = () => {
    if (isValid) {
      router.push('/(parent-setup)/summary');
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
          currentIndex={2}
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
            i18nKey="parent-setup.modules.title"
          />
          <TypographyParagraph
            style={{ color: mutedColor }}
            i18nKey="parent-setup.modules.description"
          />
        </View>

        {/* Module Cards */}
        <View className="mb-6">
          <ModuleCard
            icon="water"
            titleKey="parent-setup.modules.catheterization.title"
            descriptionKey="parent-setup.modules.catheterization.description"
            isSelected={selectedModules.has('catheterization')}
            onToggle={() => toggleModule('catheterization')}
            accentColor={accentColor}
            foregroundColor={foregroundColor}
            mutedColor={mutedColor}
            cardBgColor={cardBgColor}
          />

          <ModuleCard
            icon="document-text"
            titleKey="parent-setup.modules.bowel-movements.title"
            descriptionKey="parent-setup.modules.bowel-movements.description"
            isSelected={selectedModules.has('bowel-movements')}
            onToggle={() => toggleModule('bowel-movements')}
            accentColor={accentColor}
            foregroundColor={foregroundColor}
            mutedColor={mutedColor}
            cardBgColor={cardBgColor}
          />

          <ModuleCard
            icon="medical"
            titleKey="parent-setup.modules.enemas.title"
            descriptionKey="parent-setup.modules.enemas.description"
            isSelected={selectedModules.has('enemas')}
            onToggle={() => toggleModule('enemas')}
            accentColor={accentColor}
            foregroundColor={foregroundColor}
            mutedColor={mutedColor}
            cardBgColor={cardBgColor}
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
          progress={3 / 5}
          backgroundColor={isValid ? accentColor : mutedColor}
          progressColor={accentColor}
          size={84}
          iconSize={36}
        />
      </View>
    </View>
  );
}
