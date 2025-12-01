import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';

import { CicColor } from '../types';

interface ColorStepProps {
  selectedColor: CicColor | null;
  onColorSelect: (color: CicColor) => void;
}

export function ColorStep({ selectedColor, onColorSelect }: ColorStepProps) {
  const { t } = useTranslation();

  const colorOptions = [
    {
      value: CicColor.TRANSPARENT,
      emoji: '💎',
      labelKey: 'page.cic_register.color.transparent',
    },
    {
      value: CicColor.LIGHT_YELLOW,
      emoji: '🟡',
      labelKey: 'page.cic_register.color.light_yellow',
    },
    {
      value: CicColor.DARK_YELLOW,
      emoji: '🟠',
      labelKey: 'page.cic_register.color.dark_yellow',
    },
    {
      value: CicColor.ABNORMAL,
      emoji: '🔴',
      labelKey: 'page.cic_register.color.abnormal',
    },
  ];

  return (
    <View className="flex-1 gap-6 p-4">
      {/* Header */}
      <View className="gap-2">
        <Text
          className="text-2xl font-semibold text-foreground"
          accessibilityRole="header"
        >
          {t('page.cic_register.color.title')}
        </Text>
        <Text className="text-base text-default-500">
          {t('page.cic_register.color.description')}
        </Text>
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
              accessibilityLabel={t(option.labelKey)}
            >
              <View
                className={`flex-row items-center gap-4 p-4 rounded-xl border-2 ${
                  isSelected
                    ? 'bg-primary/10 border-primary'
                    : 'bg-default-100 border-default-200'
                }`}
              >
                <Text className="text-3xl">{option.emoji}</Text>
                <Text
                  className={`text-lg font-medium flex-1 ${
                    isSelected ? 'text-primary' : 'text-foreground'
                  }`}
                >
                  {t(option.labelKey)}
                </Text>
                {isSelected && (
                  <View className="w-6 h-6 rounded-full bg-primary items-center justify-center">
                    <Text className="text-primary-foreground text-xs">✓</Text>
                  </View>
                )}
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
