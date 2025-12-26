import type React from 'react';
import { View } from 'react-native';

import { CardAtom } from '@/ui/components/atoms/card.atom';
import { IconAtom, type IconName } from '@/ui/components/atoms/icon.atom';
import {
  TypographyParagraph,
  TypographySmall,
} from '@/ui/components/atoms/typography.atom';
import type { Ti18nKeys } from '@/ui/i18n/locales/en-EN';

interface SettingsRowProps {
  iconName: IconName;
  titleKey: Ti18nKeys;
  captionKey?: Ti18nKeys;
  onPress?: () => void;
  testID?: string;
}

export const SettingsRow: React.FC<SettingsRowProps> = ({
  iconName,
  titleKey,
  captionKey,
  onPress,
  testID,
}) => {
  return (
    <CardAtom
      onPress={onPress}
      className="flex flex-row  align-middle justify-between"
    >
      <View className="flex flex-row items-center gap-4">
        <IconAtom name={iconName} />

        <View className="flex flex-col">
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

      <View className="flex items-center justify-center">
        <IconAtom name="chevron-forward" iconSize={20} />
      </View>
    </CardAtom>
  );
};
