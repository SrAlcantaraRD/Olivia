import { Ionicons } from '@expo/vector-icons';
import { Pressable, View } from 'react-native';
import { withUniwind } from 'uniwind';

import {
  TypographyParagraph,
  TypographySmall,
  TypographySubtitle,
} from '@/ui/components/atoms/typography.atom';
import { CicColor } from '../types';

const StyledIonicons = withUniwind(Ionicons);

interface ColorStepProps {
  selectedColor: CicColor | null;
  onColorSelect: (color: CicColor) => void;
}

export function ColorStep({ selectedColor, onColorSelect }: ColorStepProps) {
  const colorOptions = [
    {
      value: CicColor.TRANSPARENT,
      icon: 'water' as const,
      labelKey: 'page.cic_register.color.transparent' as const,
    },
    {
      value: CicColor.LIGHT_YELLOW,
      icon: 'ellipse' as const,
      color: '#FCD34D' as const,
      labelKey: 'page.cic_register.color.light_yellow' as const,
    },
    {
      value: CicColor.DARK_YELLOW,
      icon: 'ellipse' as const,
      color: '#F59E0B' as const,
      labelKey: 'page.cic_register.color.dark_yellow' as const,
    },
    {
      value: CicColor.ABNORMAL,
      icon: 'warning' as const,
      color: '#EF4444' as const,
      labelKey: 'page.cic_register.color.abnormal' as const,
    },
  ];

  return (
    <View className="flex-1 gap-6 p-4">
      {/* Header */}
      <View className="gap-2">
        <TypographySubtitle
          i18nKey="page.cic_register.color.title"
          accessibilityRole="header"
        />
        <TypographySmall
          i18nKey="page.cic_register.color.description"
          variant="light"
        />
      </View>

      {/* Color Options */}
      <View className="gap-3">
        {colorOptions.map((option) => {
          const isSelected = selectedColor === option.value;
          return (
            <Pressable
              key={option.value}
              onPress={() => onColorSelect(option.value)}
              accessibilityRole="radio"
              accessibilityState={{ checked: isSelected }}
              accessibilityLabel={option.labelKey}
            >
              <View
                className={`flex-row items-center gap-4 p-4 rounded-xl border-2 ${
                  isSelected
                    ? 'bg-primary/10 border-primary'
                    : 'bg-default-100 border-default-200'
                }`}
              >
                <StyledIonicons
                  name={option.icon}
                  size={32}
                  className={isSelected ? 'text-primary' : 'text-foreground'}
                  color={option.color}
                />
                <TypographyParagraph
                  i18nKey={option.labelKey}
                  className={`text-lg font-medium flex-1 ${
                    isSelected ? 'text-primary' : ''
                  }`}
                />
                {isSelected && (
                  <StyledIonicons
                    name="checkmark-circle"
                    size={24}
                    className="text-primary"
                  />
                )}
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
