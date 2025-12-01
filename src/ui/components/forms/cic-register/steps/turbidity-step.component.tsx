import { Ionicons } from '@expo/vector-icons';
import { Pressable, View } from 'react-native';
import { withUniwind } from 'uniwind';

import {
  TypographyParagraph,
  TypographySmall,
  TypographySubtitle,
} from '@/ui/components/atoms/typography.atom';
import { CicTurbidity } from '../types';

const StyledIonicons = withUniwind(Ionicons);

interface TurbidityStepProps {
  selectedTurbidity: CicTurbidity | null;
  onTurbiditySelect: (turbidity: CicTurbidity) => void;
}

export function TurbidityStep({
  selectedTurbidity,
  onTurbiditySelect,
}: TurbidityStepProps) {
  const turbidityOptions = [
    {
      value: CicTurbidity.CLEAR,
      icon: 'sparkles' as const,
      labelKey: 'page.cic_register.turbidity.clear' as const,
    },
    {
      value: CicTurbidity.SLIGHT,
      icon: 'partly-sunny' as const,
      labelKey: 'page.cic_register.turbidity.slight' as const,
    },
    {
      value: CicTurbidity.HIGH,
      icon: 'cloudy' as const,
      labelKey: 'page.cic_register.turbidity.high' as const,
    },
  ];

  return (
    <View className="flex-1 gap-6 p-4">
      {/* Header */}
      <View className="gap-2">
        <TypographySubtitle
          i18nKey="page.cic_register.turbidity.title"
          accessibilityRole="header"
        />
        <TypographySmall
          i18nKey="page.cic_register.turbidity.description"
          variant="light"
        />
      </View>

      {/* Turbidity Options */}
      <View className="gap-3">
        {turbidityOptions.map((option) => {
          const isSelected = selectedTurbidity === option.value;
          return (
            <Pressable
              key={option.value}
              onPress={() => onTurbiditySelect(option.value)}
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
