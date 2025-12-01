import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';

import { CicVolume } from '../types';

interface VolumeStepProps {
  selectedVolume: CicVolume | null;
  onVolumeSelect: (volume: CicVolume) => void;
}

export function VolumeStep({
  selectedVolume,
  onVolumeSelect,
}: VolumeStepProps) {
  const { t } = useTranslation();

  const volumeOptions = [
    {
      value: CicVolume.LOW,
      emoji: '🔽',
      labelKey: 'page.cic_register.volume.low',
    },
    {
      value: CicVolume.NORMAL,
      emoji: '✓',
      labelKey: 'page.cic_register.volume.normal',
    },
    {
      value: CicVolume.HIGH,
      emoji: '🔼',
      labelKey: 'page.cic_register.volume.high',
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
          {t('page.cic_register.volume.title')}
        </Text>
        <Text className="text-base text-default-500">
          {t('page.cic_register.volume.description')}
        </Text>
      </View>

      {/* Volume Options */}
      <View className="gap-3">
        {volumeOptions.map((option) => {
          const isSelected = selectedVolume === option.value;
          return (
            <Pressable
              key={option.value}
              onPress={() => onVolumeSelect(option.value)}
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
