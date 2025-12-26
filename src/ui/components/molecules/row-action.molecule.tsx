import type React from 'react';
import { View } from 'react-native';

import { CardAtom } from '@/ui/components/atoms/card.atom';
import { IconAtom, type IconName } from '@/ui/components/atoms/icon.atom';
import {
  TypographyParagraph,
  TypographySmall,
} from '@/ui/components/atoms/typography.atom';
import type { Ti18nKeys } from '@/ui/i18n/locales/en-EN';
import { cn } from '@/ui/lib/utils';

export interface RowActionProps {
  iconName: IconName;
  title: Ti18nKeys;
  description?: Ti18nKeys;
  onPress?: () => void;
  testID?: string;
  className?: string;
  variant?: 'default' | 'danger';
}

export const RowAction: React.FC<RowActionProps> = ({
  iconName,
  title,
  description,
  onPress,
  testID,
  className,
  variant = 'default',
}) => {
  return (
    <CardAtom
      onPress={onPress}
      className={cn(
        'flex flex-row items-center justify-between',
        className,
        variant === 'danger' && 'light:bg-danger/40 dark:bg-danger/30'
      )}
    >
      <View className="flex flex-row items-center gap-4 flex-1">
        <IconAtom name={iconName} variant={variant} iconSize={20} />

        <View className="flex flex-col flex-1">
          <TypographyParagraph
            i18nKey={title}
            testID={`${testID}.title`}
            className="font-medium"
          />
          {description && (
            <TypographySmall
              i18nKey={description}
              testID={`${testID}.caption`}
              variant="light"
            />
          )}
        </View>
      </View>

      <View className="flex items-center justify-center ml-2">
        <IconAtom
          name="chevron-forward"
          iconSize={20}
          variant={variant}
          emptyBackground
        />
      </View>
    </CardAtom>
  );
};
