import { FlashList } from '@shopify/flash-list';
import type React from 'react';
import { View } from 'react-native';

import { TypographySmall } from '@/ui/components/atoms/typography.atom';
import type { Ti18nKeys } from '@/ui/i18n/locales/en-EN';

interface HistoryListProps<T> {
  items: T[];
  testID: string;
  emptyI18nKey: Ti18nKeys;
  /** Optional: render a custom item. If omitted, will render `HistoryRow` (casts `any`). */
  renderItem: (item: T) => React.ReactElement | null;
  keyExtractor: (item: T) => string;
}

export const HistoryList = <T,>({
  items,
  testID,
  emptyI18nKey,
  renderItem,
  keyExtractor,
}: HistoryListProps<T>) => {
  if (!items || items.length === 0) {
    return (
      <TypographySmall
        testID={`${testID}.no-history`}
        i18nKey={emptyI18nKey}
        variant="light"
        className="text-center"
      />
    );
  }

  return (
    <View className="rounded-md overflow-hidden">
      <FlashList
        testID={`${testID}.list`}
        data={items}
        renderItem={({ item }) => {
          return renderItem(item);
        }}
        keyExtractor={(item) => keyExtractor(item)}
        ItemSeparatorComponent={() => <View className="h-px bg-default-100" />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};
