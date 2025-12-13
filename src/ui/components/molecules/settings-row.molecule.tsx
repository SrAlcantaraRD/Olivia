import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from 'heroui-native';
import type React from 'react';
import { Pressable, View } from 'react-native';
import { withUniwind } from 'uniwind';

import { CardAtom } from '@/ui/components/atoms/card.atom';
import type { IconName } from '@/ui/components/atoms/icon.atom';
import {
  TypographyParagraph,
  TypographySmall,
} from '@/ui/components/atoms/typography.atom';
import type { Ti18nKeys } from '@/ui/i18n/locales/en-EN';

const StyledIonicons = withUniwind(Ionicons);

interface SettingsRowProps {
  iconName: IconName;
  titleKey: Ti18nKeys;
  captionKey?: Ti18nKeys;
  onPress?: () => void;
  testID?: string;
  hasDivider?: boolean;
}

export const SettingsRow: React.FC<SettingsRowProps> = ({
  iconName,
  titleKey,
  captionKey,
  onPress,
  testID,
  hasDivider = false,
}) => {
  const accentColor = useThemeColor('accent');
  const _foregroundColor = useThemeColor('foreground');
  const dividerColor = useThemeColor('divider');

  // Chip background: use a 12% alpha variant if accentColor is hex
  const chipBg = `${accentColor}20`;

  return (
    <CardAtom className="p-0 my-2">
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
              width: 34,
              height: 34,
              borderRadius: 12,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: chipBg,
            }}
          >
            <StyledIonicons
              name={iconName}
              size={20}
              style={{ color: accentColor }}
            />
          </View>

          <View style={{ flexDirection: 'column' }}>
            <TypographyParagraph
              i18nKey={titleKey}
              testID={`${testID}.title`}
              className="font-medium"
            />
            {captionKey && (
              <TypographySmall
                i18nKey={captionKey}
                testID={`${testID}.caption`}
                variant="light"
              />
            )}
          </View>
        </View>

        <StyledIonicons
          name="chevron-forward"
          size={18}
          style={{ color: dividerColor }}
        />
      </Pressable>

      {hasDivider && (
        <View
          style={{
            height: 1,
            marginLeft: 60, // inset of 60 to align with chips
            backgroundColor: dividerColor,
          }}
        />
      )}
    </CardAtom>
  );
};
