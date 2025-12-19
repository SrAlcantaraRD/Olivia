import { useThemeColor } from 'heroui-native';
import type React from 'react';
import { Pressable, View } from 'react-native';

import type { Ti18nKeys } from '@/domain/core/types/i18n.types';
import { SelectableCard } from '@/ui/components/atoms/selectable-card.atom';
import { TypographySmall } from '@/ui/components/atoms/typography.atom';

interface SummaryPeriodSelectorProps {
  options: Array<{ value: string; labelKey: Ti18nKeys }>;
  selected: string;
  onSelect?: (value: string) => void;
  testID: string;
}

export const SummaryPeriodSelector: React.FC<SummaryPeriodSelectorProps> = ({
  options,
  selected,
  onSelect,
  testID,
}) => {
  const mutedColor = useThemeColor('muted');

  return (
    <View
      className="flex-row rounded-2xl p-1"
      style={{ backgroundColor: `${mutedColor}20` }}
    >
      {options.map((option) => {
        return (
          <Pressable
            key={`${testID}.${option.value}`}
            accessibilityRole="button"
            onPress={() => onSelect?.(option.value)}
            style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
            className="flex-1"
          >
            <SelectableCard
              key={`${testID}.range-select.${option.value}`}
              testID={`${testID}.range-select.${option.value}`}
              isSelected={selected === option.value}
              onPress={() => onSelect?.(option.value)}
              className="h-20 w-20 justify-center items-center"
            >
              <TypographySmall
                testID={`${testID}.${option.value}.label`}
                i18nKey={option.labelKey}
                className="font-semibold"
              />
            </SelectableCard>
          </Pressable>
        );
      })}
    </View>
  );
};
