import { useTranslation } from 'react-i18next';
import { Pressable, Text, TextInput, View } from 'react-native';

import { CicDiscomfort } from '../types';

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
      emoji: '✅',
      labelKey: 'page.cic_register.discomfort.none',
    },
    {
      value: CicDiscomfort.SLIGHT,
      emoji: '😐',
      labelKey: 'page.cic_register.discomfort.slight',
    },
    {
      value: CicDiscomfort.PAIN,
      emoji: '😣',
      labelKey: 'page.cic_register.discomfort.pain',
    },
  ];

  const showNoteInput = selectedDiscomfort === CicDiscomfort.PAIN;

  return (
    <View className="flex-1 gap-6 p-4">
      {/* Header */}
      <View className="gap-2">
        <Text
          className="text-2xl font-semibold text-foreground"
          accessibilityRole="header"
        >
          {t('page.cic_register.discomfort.title')}
        </Text>
        <Text className="text-base text-default-500">
          {t('page.cic_register.discomfort.description')}
        </Text>
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

      {/* Conditional Note Input for Pain */}
      {showNoteInput && (
        <View className="gap-2">
          <Text className="text-sm font-medium text-foreground">
            {t('page.cic_register.discomfort.note_label')}
          </Text>
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
