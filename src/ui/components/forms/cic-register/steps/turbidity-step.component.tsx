import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';

import { CicTurbidity } from '../types';

interface TurbidityStepProps {
  selectedTurbidity: CicTurbidity | null;
  onTurbiditySelect: (turbidity: CicTurbidity) => void;
}

export function TurbidityStep({
  selectedTurbidity,
  onTurbiditySelect,
}: TurbidityStepProps) {
  const { t } = useTranslation();

  const turbidityOptions = [
    {
      value: CicTurbidity.CLEAR,
      emoji: '✨',
      labelKey: 'page.cic_register.turbidity.clear',
    },
    {
      value: CicTurbidity.SLIGHT,
      emoji: '🌫️',
      labelKey: 'page.cic_register.turbidity.slight',
    },
    {
      value: CicTurbidity.HIGH,
      emoji: '☁️',
      labelKey: 'page.cic_register.turbidity.high',
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
          {t('page.cic_register.turbidity.title')}
        </Text>
        <Text className="text-base text-default-500">
          {t('page.cic_register.turbidity.description')}
        </Text>
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
