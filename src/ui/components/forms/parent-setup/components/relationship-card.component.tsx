import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from 'heroui-native';
import { Text, View } from 'react-native';

import { SelectableCard } from '@/ui/components/atoms/selectable-card.atom';

interface RelationshipCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  isSelected: boolean;
  onSelect: () => void;
  accentColor: string;
  mutedColor: string;
  cardBgColor: string;
}

export function RelationshipCard({
  icon,
  label,
  isSelected,
  onSelect,
  accentColor,
  mutedColor,
  cardBgColor,
}: RelationshipCardProps) {
  const foregroundColor = useThemeColor('foreground');

  return (
    <SelectableCard
      isSelected={isSelected}
      onSelect={onSelect}
      accentColor={accentColor}
      mutedColor={mutedColor}
      cardBgColor={cardBgColor}
      className="p-4 items-center"
      flex
    >
      <View
        style={{ backgroundColor: accentColor }}
        className="rounded-2xl p-4 w-16 h-16 items-center justify-center mb-3"
      >
        <Ionicons name={icon} size={32} color="white" />
      </View>

      <Text
        style={{ color: foregroundColor }}
        className="text-center text-base font-medium"
      >
        {label}
      </Text>
    </SelectableCard>
  );
}
