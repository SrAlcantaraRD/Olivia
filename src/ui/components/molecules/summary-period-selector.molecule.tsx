import { useThemeColor } from 'heroui-native';
import type React from 'react';
import { Pressable, View } from 'react-native';

import { SelectableCard } from '@/ui/components/atoms/selectable-card.atom';
import { TypographySmall } from '@/ui/components/atoms/typography.atom';

interface SummaryPeriodSelectorProps {
  options: string[];
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
            key={`${testID}.${option}`}
            accessibilityRole="button"
            onPress={() => onSelect?.(option)}
            style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
            className="flex-1"
          >
            <SelectableCard
              key={`${testID}.range-select.${option}`}
              testID={`${testID}.range-select.${option}`}
              isSelected={selected === option}
              onPress={() => onSelect?.(option)}
              className="h-20 w-20 justify-center items-center"
            >
              <TypographySmall
                testID={`${testID}.${option}.label`}
                i18nKey="common.raw-value"
                values={{ value: option }}
                className="font-semibold"
              />
            </SelectableCard>
          </Pressable>
        );
      })}
    </View>
  );
};
