import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from 'heroui-native';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { useAdapters } from '@/adapter';
import { AtomLogoSVG } from '@/ui/components/atoms/logo.atom';
import {
  TypographyParagraph,
  TypographyTitle,
} from '@/ui/components/atoms/typography.atom';
import { ScreenLayout } from '@/ui/components/layouts/screen.layout';
import { CardWithDetails } from '@/ui/components/molecules/card-with-details.molecule';
import { useNavigation } from '@/ui/hook/use-navigation.hook';

enum ROLE_ENUM {
  PARENT = 'parent',
  CAREGIVER = 'caregiver',
}

export default function RoleSelectionScreen() {
  const { navigationAdapter } = useAdapters();
  const { goToParentSetup, goToSecondaryCarerSetup, goBack } = useNavigation({
    navigationAdapter,
  });
  const [selectedRole, setSelectedRole] = useState<ROLE_ENUM | null>(null);

  const foregroundColor = useThemeColor('foreground');
  const mutedColor = useThemeColor('muted');
  const accentColor = useThemeColor('accent');

  const handleContinue = () => {
    if (selectedRole === ROLE_ENUM.PARENT) {
      goToParentSetup();
    } else if (selectedRole === ROLE_ENUM.CAREGIVER) {
      goToSecondaryCarerSetup();
    }
  };

  return (
    <ScreenLayout testID="role-selection-screen">
      {/* Header */}
      <View className="flex-row items-center justify-between pt-12 pb-4">
        <Pressable onPress={goBack}>
          <Ionicons name="chevron-back" size={24} color={foregroundColor} />
        </Pressable>
        <AtomLogoSVG width={40} height={40} />
        <View className="w-8" />
      </View>

      {/* Content */}
      <View className="flex-1">
        {/* Title */}
        <View className="mb-8">
          <TypographyTitle
            testID="screen.role-selection.title"
            style={{ color: foregroundColor }}
            className="mb-2 text-center"
            i18nKey="role-selection-screen.title"
          />
          <TypographyParagraph
            testID="screen.role-selection.description"
            style={{ color: mutedColor }}
            className="text-center"
            i18nKey="role-selection-screen.description"
          />
        </View>

        {/* Role Cards */}
        <View className="mb-8 gap-8">
          <CardWithDetails
            icon="heart"
            title="role-selection-screen.parent.title"
            subtitle="role-selection-screen.parent.subtitle"
            description="role-selection-screen.parent.description"
            testID="role-selection.parent"
            isSelected={selectedRole === ROLE_ENUM.PARENT}
            onPress={() => setSelectedRole(ROLE_ENUM.PARENT)}
          />

          <CardWithDetails
            icon="people"
            title="role-selection-screen.caregiver.title"
            subtitle="role-selection-screen.caregiver.subtitle"
            description="role-selection-screen.caregiver.description"
            testID="role-selection.caregiver"
            isSelected={selectedRole === ROLE_ENUM.CAREGIVER}
            onPress={() => setSelectedRole(ROLE_ENUM.CAREGIVER)}
          />
        </View>
      </View>

      {/* Footer */}
      <View className="pb-12">
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
            testID="screen.role-selection.continue"
            style={{ color: 'white' }}
            weight="semibold"
            size="lg"
            i18nKey="continue"
          />
        </Pressable>
      </View>
    </ScreenLayout>
  );
}
