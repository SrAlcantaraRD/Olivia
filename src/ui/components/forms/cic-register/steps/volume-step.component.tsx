import { Ionicons } from '@expo/vector-icons';
import { Pressable, View } from 'react-native';
import { withUniwind } from 'uniwind';

import {
  Typography,
  TypographySmall,
  TypographySubtitle,
} from '@/ui/components/atoms/typography.atom';
import { CicVolume } from '../types';

const StyledIonicons = withUniwind(Ionicons);

interface VolumeStepProps {
  selectedVolume: CicVolume | null;
  onVolumeSelect: (volume: CicVolume) => void;
}

export function VolumeStep({
  selectedVolume,
  onVolumeSelect,
}: VolumeStepProps) {
  const volumeOptions = [
    {
      value: CicVolume.LOW,
      icon: 'arrow-down-circle' as const,
      labelKey: 'page.cic_register.volume.low' as const,
    },
    {
      value: CicVolume.NORMAL,
      icon: 'checkmark-circle' as const,
      labelKey: 'page.cic_register.volume.normal' as const,
    },
    {
      value: CicVolume.HIGH,
      icon: 'arrow-up-circle' as const,
      labelKey: 'page.cic_register.volume.high' as const,
    },
  ];

  return (
    <View className="flex-1 gap-6 p-4">
      {/* Header */}
      <View className="gap-2">
        <TypographySubtitle
          i18nKey="page.cic_register.volume.title"
          accessibilityRole="header"
        />
        <TypographySmall
          i18nKey="page.cic_register.volume.description"
          variant="light"
        />
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
                <Typography
                  i18nKey={option.labelKey}
                  className={`text-lg font-medium flex-1 ${
                    isSelected ? 'text-primary' : 'text-foreground'
                  }`}
                />
                {isSelected && (
                  <View className="w-6 h-6 rounded-full bg-primary items-center justify-center">
                    <Typography className="text-primary-foreground text-xs">
                      ✓
                    </Typography>
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
