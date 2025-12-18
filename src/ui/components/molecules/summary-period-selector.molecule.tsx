import { useThemeColor } from 'heroui-native';
import type React from 'react';
import { Pressable, View } from 'react-native';

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
  const accentColor = useThemeColor('accent');
  const mutedColor = useThemeColor('muted');
  const backgroundColor = useThemeColor('background');

  return (
    <View
      className="flex-row rounded-2xl p-1"
      style={{ backgroundColor: `${mutedColor}20` }}
    >
      {options.map((option) => {
        const isActive = option === selected;
        return (
          <Pressable
            key={`${testID}.${option}`}
            accessibilityRole="button"
            onPress={() => onSelect?.(option)}
            style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
            className="flex-1"
          >
            <View
              style={{
                paddingVertical: 6,
                borderRadius: 12,
                alignItems: 'center',
                backgroundColor: isActive ? `${mutedColor}60` : backgroundColor,
              }}
            >
              <TypographySmall
                testID={`${testID}.${option}.label`}
                i18nKey="common.raw-value"
                values={{ value: option }}
                className="font-semibold"
              />
            </View>
          </Pressable>
        );
      })}
    </View>
  );
};
