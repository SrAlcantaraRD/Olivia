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
      <View className="mb-6" testID="parent-name-input">
        <TextFieldAtom
          label="parent-setup.parent-info.name-label"
          placeholder="parent-setup.parent-info.name-placeholder"
          isRequired
          value={name}
          onChangeText={onNameChange}
          testID="parent-name-input"
        />
      </View>

      {/* Relationship Selection */}
      <View className="mb-6 flex-1">
        <TypographyParagraph
          style={{ color: foregroundColor }}
          className="mb-4"
          weight="medium"
          i18nKey="parent-setup.parent-info.relationship-label"
          testID="screen.parent-setup.parent-info.relationship_label"
        />
        <View className="flex-1 flex-col gap-4">
          <CardWithDetails
            icon="heart"
            title="parent-setup.parent-info.parent"
            isSelected={relationship === 'parent'}
            onPress={() => onRelationshipChange('parent')}
            testID="parent-relationship-parent"
          />
          <CardWithDetails
            icon="shield"
            title="parent-setup.parent-info.guardian"
            isSelected={relationship === 'guardian'}
            onPress={() => onRelationshipChange('guardian')}
            testID="parent-relationship-guardian"
          />
        </View>
      </View>
    </View>
  );
}
