import { tz } from '@date-fns/tz';
import { formatDistanceToNowStrict } from 'date-fns';
import type { FC } from 'react';
import { Pressable, View } from 'react-native';

import type { TRecord } from '@/domain/module/entity/record.entity';
import { MODULE_KEY_ENUM } from '@/domain/module/enum/module-key.enum';
import { CardAtom } from '@/ui/components/atoms/card.atom';
import { IconAtom, type IconName } from '@/ui/components/atoms/icon.atom';
import { TypographySmall } from '@/ui/components/atoms/typography.atom';

interface HistoryRowProps {
  record: TRecord;
  testID: string;
  onPress?: () => void;
}

const MODULE_ICON_MAP: Record<MODULE_KEY_ENUM, IconName> = Object.freeze({
  [MODULE_KEY_ENUM.CIC]: 'bandage',
  [MODULE_KEY_ENUM.URINE]: 'water',
  [MODULE_KEY_ENUM.STOOL]: 'nutrition',
  [MODULE_KEY_ENUM.MEDICATION]: 'medical',
  [MODULE_KEY_ENUM.ENEMA]: 'trending-up',
});

export const HistoryRow: FC<HistoryRowProps> = ({
  record,
  onPress,
  testID,
}) => {
  const moduleName = record.module?.name ?? String(record.moduleID ?? '');

  return (
    <Pressable onPress={onPress} accessibilityRole="button">
      <CardAtom className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          <View
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <IconAtom
              name={MODULE_ICON_MAP[record.module?.code ?? MODULE_KEY_ENUM.CIC]}
            />
          </View>
          <View>
            <TypographySmall
              i18nKey="common.raw-value"
              testID={`${testID}.moduel-name`}
              values={{
                value: moduleName,
              }}
              className="font-medium"
            />

            <TypographySmall
              variant="light"
              i18nKey="common.raw-value"
              testID={`${testID}.moduel-name`}
              values={{
                value: formatDistanceToNowStrict(record.createdAt, {
                  addSuffix: true,
                  // TODO: Move to enviroment-variablo or load from ¿device?
                  in: tz('Europe/Madrid'),
                }),
              }}
            />
          </View>
        </View>
      </CardAtom>
    </Pressable>
  );
};
