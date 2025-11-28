import { Ionicons } from '@expo/vector-icons';
import { Pressable, View } from 'react-native';

import { TypographyParagraph } from '@/ui/components/atoms/typography.atom';

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

export function RelationshipCard({
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
