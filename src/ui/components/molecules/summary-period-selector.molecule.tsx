import { useThemeColor } from 'heroui-native';
import type React from 'react';
import { View } from 'react-native';

import type { Ti18nKeys } from '@/domain/core/types/i18n.types';
import { CardAtom } from '@/ui/components/atoms/card.atom';
import { TypographySmall } from '@/ui/components/atoms/typography.atom';

interface SummaryPeriodSelectorProps {
  options: { value: string; labelKey: Ti18nKeys }[];
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

  const handlerOnSelect = (value: string) => {
    setTimeout(() => {
      onSelect?.(value);
    }, 300);
  };

  return (
    <View
      className="flex-row rounded-lg p-1 justify-between"
      style={{ backgroundColor: `${mutedColor}20` }}
    >
      {options.map((option) => {
        return (
          <CardAtom
            key={`${testID}.range-select.${option.value}`}
            testID={`${testID}.range-select.${option.value}`}
            isSelected={selected === option.value}
            isSelectable
            onPress={() => handlerOnSelect(option.value)}
            className="flex-1 h-12 justify-center items-center"
          >
            <TypographySmall
              testID={`${testID}.${option.value}.label`}
              i18nKey={option.labelKey}
              className="font-medium text-[10px]"
            />
          </CardAtom>
        );
      })}
    </View>
  );
};
