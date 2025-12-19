import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from 'heroui-native';
import type React from 'react';
import { Pressable, View } from 'react-native';
import { withUniwind } from 'uniwind';

import { CardAtom } from '@/ui/components/atoms/card.atom';
import type { IconName } from '@/ui/components/atoms/icon.atom';
import { TypographyParagraph } from '@/ui/components/atoms/typography.atom';
import type { Ti18nKeys } from '@/ui/i18n/locales/en-EN';

const StyledIonicons = withUniwind(Ionicons);

interface SummaryRowProps {
  iconName: IconName;
  titleKey: Ti18nKeys;
  onPress?: () => void;
  testID: string;
}

export const SummaryRow: React.FC<SummaryRowProps> = ({
  iconName,
  titleKey,
  onPress,
  testID,
}) => {
  const accentColor = useThemeColor('accent');
  const mutedColor = useThemeColor('muted');

  return (
    <CardAtom className="p-0">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={testID}
        onPress={onPress}
        style={({ pressed }) => ({
          minHeight: 60,
          padding: 14,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          opacity: pressed ? 0.7 : 1,
        })}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: 12,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: `${accentColor}20`,
            }}
          >
            <StyledIonicons
              name={iconName}
              size={18}
              style={{ color: accentColor }}
            />
          </View>

          <TypographyParagraph
            i18nKey={titleKey}
            testID={`${testID}.title`}
            className="font-medium"
          />
        </View>

        <StyledIonicons
          name="chevron-forward"
          size={18}
          style={{ color: mutedColor }}
        />
      </Pressable>
    </CardAtom>
  );
};
