import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useThemeColor } from 'heroui-native';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { AtomLogoSVG } from '@/ui/components/atoms/logo.atom';
import {
  TypographyParagraph,
  TypographyTitle,
} from '@/ui/components/atoms/typography.atom';
import { CardWithDetails } from '@/ui/components/molecules/card-with-details.molecule';

enum ROLE_ENUM {
  PARENT = 'parent',
  CAREGIVER = 'caregiver',
}

export default function RoleSelectionScreen() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<ROLE_ENUM | null>(null);

  const backgroundColor = useThemeColor('background');
  const foregroundColor = useThemeColor('foreground');
  const mutedColor = useThemeColor('muted');
  const accentColor = useThemeColor('accent');

  const handleContinue = () => {
    if (selectedRole === 'parent') {
      router.push('/(onboarding)/parent-setup');
    } else if (selectedRole === 'caregiver') {
      router.push('/(caregiver-setup)/scan-qr');
    }
  };

  return (
    <View style={{ backgroundColor }} className="flex-1">
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 pt-12 pb-4">
        <Pressable onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={foregroundColor} />
        </Pressable>
        <AtomLogoSVG width={40} height={40} />
        <View className="w-8" />
      </View>

      {/* Content */}
      <View className="flex-1 px-6">
        {/* Title */}
        <View className="mb-8">
          <TypographyTitle
            style={{ color: foregroundColor }}
            className="mb-2 text-center"
            i18nKey="role-selection-screen.title"
          />
          <TypographyParagraph
            style={{ color: mutedColor }}
            className="text-center"
            i18nKey="role-selection-screen.description"
          />
        </View>

        {/* Role Cards */}
        <View className="mb-8">
          <CardWithDetails
            icon="heart"
            titleKey="role-selection-screen.parent.title"
            subtitleKey="role-selection-screen.parent.subtitle"
            descriptionKey="role-selection-screen.parent.description"
            isSelected={selectedRole === ROLE_ENUM.PARENT}
            onSelect={() => setSelectedRole(ROLE_ENUM.PARENT)}
            className="p-6 mb-4"
            hideIndicator
          />

          <CardWithDetails
            icon="people"
            titleKey="role-selection-screen.caregiver.title"
            subtitleKey="role-selection-screen.caregiver.subtitle"
            descriptionKey="role-selection-screen.caregiver.description"
            isSelected={selectedRole === ROLE_ENUM.CAREGIVER}
            onSelect={() => setSelectedRole(ROLE_ENUM.CAREGIVER)}
            className="p-6 mb-4"
            hideIndicator
          />
        </View>
      </View>

      {/* Footer */}
      <View className="px-6 pb-12">
        <Pressable
          onPress={handleContinue}
          disabled={!selectedRole}
          style={{
            backgroundColor: selectedRole ? accentColor : mutedColor,
            opacity: selectedRole ? 1 : 0.5,
          }}
          className="rounded-full py-4 items-center"
        >
          <TypographyParagraph
            style={{ color: 'white' }}
            weight="semibold"
            size="lg"
            i18nKey="continue"
          />
        </Pressable>
      </View>
    </View>
  );
}
