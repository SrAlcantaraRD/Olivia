import { useThemeColor } from 'heroui-native';
import { View } from 'react-native';

import { TextFieldAtom } from '@/ui/components/atoms/text-field.atom';
import { TypographyParagraph } from '@/ui/components/atoms/typography.atom';
import { CardWithDetails } from '@/ui/components/molecules/card-with-details.molecule';
import type { Relationship } from '../types';

interface ParentInfoStepProps {
  name: string;
  relationship: Relationship | null;
  onNameChange: (name: string) => void;
  onRelationshipChange: (relationship: Relationship) => void;
}

export function ParentInfoStep({
  name,
  relationship,
  onNameChange,
  onRelationshipChange,
}: ParentInfoStepProps) {
  const foregroundColor = useThemeColor('foreground');

  return (
    <View className="flex-1">
      {/* Name Input */}
      <View className="mb-6">
        <TextFieldAtom
          label="parent-setup.parent-info.name-label"
          placeholder="parent-setup.parent-info.name-placeholder"
          isRequired
          value={name}
          onChangeText={onNameChange}
        />
      </View>

      {/* Relationship Selection */}
      <View className="mb-6 flex-1">
        <TypographyParagraph
          style={{ color: foregroundColor }}
          className="mb-4"
          weight="medium"
          i18nKey="parent-setup.parent-info.relationship-label"
        />
        <View className="flex-1 flex-col gap-4">
          <CardWithDetails
            icon="heart"
            titleKey="parent-setup.parent-info.parent"
            isSelected={relationship === 'parent'}
            onSelect={() => onRelationshipChange('parent')}
          />
          <CardWithDetails
            icon="shield"
            titleKey="parent-setup.parent-info.guardian"
            isSelected={relationship === 'guardian'}
            onSelect={() => onRelationshipChange('guardian')}
          />
        </View>
      </View>
    </View>
  );
}
