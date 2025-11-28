import { useThemeColor } from 'heroui-native';
import { View } from 'react-native';

import { TextFieldAtom } from '@/ui/components/atoms/text-field.atom';
import { TypographyParagraph } from '@/ui/components/atoms/typography.atom';
import { RelationshipCard } from '../components/relationship-card.component';
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
  const mutedColor = useThemeColor('muted');
  const accentColor = useThemeColor('accent');
  const cardBgColor = useThemeColor('surface');

  return (
    <>
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
            onSelect={() => onRelationshipChange('parent')}
            accentColor={accentColor}
            foregroundColor={foregroundColor}
            mutedColor={mutedColor}
            cardBgColor={cardBgColor}
          />
          <RelationshipCard
            icon="shield"
            label="Tutor"
            isSelected={relationship === 'guardian'}
            onSelect={() => onRelationshipChange('guardian')}
            accentColor={accentColor}
            foregroundColor={foregroundColor}
            mutedColor={mutedColor}
            cardBgColor={cardBgColor}
          />
        </View>
      </View>
    </>
  );
}
