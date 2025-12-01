import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Pressable, TextInput, View } from 'react-native';
import { withUniwind } from 'uniwind';

import {
  Typography,
  TypographySmall,
  TypographySubtitle,
} from '@/ui/components/atoms/typography.atom';
import { CicDiscomfort } from '../types';

const StyledIonicons = withUniwind(Ionicons);

interface DiscomfortStepProps {
  selectedDiscomfort: CicDiscomfort | null;
  discomfortNote: string;
  onDiscomfortSelect: (discomfort: CicDiscomfort) => void;
  onDiscomfortNoteChange: (note: string) => void;
}

export function DiscomfortStep({
  selectedDiscomfort,
  discomfortNote,
  onDiscomfortSelect,
  onDiscomfortNoteChange,
}: DiscomfortStepProps) {
  const { t } = useTranslation();

  const discomfortOptions = [
    {
      value: CicDiscomfort.NONE,
      icon: 'checkmark-circle' as const,
      color: '#10B981' as const,
      labelKey: 'page.cic_register.discomfort.none' as const,
    },
    {
      value: CicDiscomfort.SLIGHT,
      icon: 'alert-circle' as const,
      color: '#F59E0B' as const,
      labelKey: 'page.cic_register.discomfort.slight' as const,
    },
    {
      value: CicDiscomfort.PAIN,
      icon: 'warning' as const,
      color: '#EF4444' as const,
      labelKey: 'page.cic_register.discomfort.pain' as const,
    },
  ];

  const showNoteInput = selectedDiscomfort === CicDiscomfort.PAIN;

  return (
    <View className="flex-1 gap-6 p-4">
      {/* Header */}
      <View className="gap-2">
        <TypographySubtitle
          i18nKey="page.cic_register.discomfort.title"
          accessibilityRole="header"
        />
        <TypographySmall
          i18nKey="page.cic_register.discomfort.description"
          variant="light"
        />
      </View>

      {/* Discomfort Options */}
      <View className="gap-3">
        {discomfortOptions.map((option) => {
          const isSelected = selectedDiscomfort === option.value;
          return (
            <Pressable
              key={option.value}
              onPress={() => onDiscomfortSelect(option.value)}
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
                  style={{ color: option.color }}
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

      {/* Conditional Note Input for Pain */}
      {showNoteInput && (
        <View className="gap-2">
          <TypographySmall
            i18nKey="page.cic_register.discomfort.note_label"
            className="font-medium"
          />
          <TextInput
            value={discomfortNote}
            onChangeText={onDiscomfortNoteChange}
            placeholder={t('page.cic_register.discomfort.note_placeholder')}
            placeholderTextColor="rgb(163 163 163)"
            multiline
            numberOfLines={3}
            className="p-4 bg-default-100 rounded-xl border-2 border-default-200 text-foreground"
            accessibilityLabel={t('page.cic_register.discomfort.note_label')}
            accessibilityHint="Describe el dolor o las molestias observadas"
          />
        </View>
      )}
    </View>
  );
}
