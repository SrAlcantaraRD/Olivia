import { useThemeColor } from 'heroui-native';
import type React from 'react';
import { View } from 'react-native';

import type { SUMMARY_PERIOD_ENUM } from '@/domain/summary/enum/summary-period.enum';
import { CardAtom } from '@/ui/components/atoms/card.atom';
import { TypographySmall } from '@/ui/components/atoms/typography.atom';
import type { Ti18nKeys } from '@/ui/i18n/locales/en-EN';

interface SummaryPeriodSelectorProps {
  options: { value: SUMMARY_PERIOD_ENUM; labelKey: Ti18nKeys }[];
  selected: SUMMARY_PERIOD_ENUM;
  onSelect?: (value: SUMMARY_PERIOD_ENUM) => void;
  testID: string;
}

export const SummaryPeriodSelector: React.FC<SummaryPeriodSelectorProps> = ({
  options,
  selected,
  onSelect,
  testID,
}) => {
  const mutedColor = useThemeColor('muted');

  const handlerOnSelect = (value: SUMMARY_PERIOD_ENUM) => {
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
