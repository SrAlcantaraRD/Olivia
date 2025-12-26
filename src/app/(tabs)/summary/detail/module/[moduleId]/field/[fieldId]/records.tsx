import { FlashList } from '@shopify/flash-list';
import { format } from 'date-fns';
import { useLocalSearchParams } from 'expo-router';
import { memo, useEffect } from 'react';
import { View } from 'react-native';

import { useAdapters } from '@/adapter';
import type { TRecordField } from '@/domain/module/entity/record-field.entity';
import { useGetRecordFieldList } from '@/domain/module/hook/get-record-field-list.hook';
import { CardAtom } from '@/ui/components/atoms/card.atom';
import {
  TypographyParagraph,
  TypographySmall,
} from '@/ui/components/atoms/typography.atom';
import { ScreenLayout } from '@/ui/components/layouts/screen.layout';
import { cn } from '@/ui/lib/utils';

const RecordItem = memo(
  ({ item, index }: { item: TRecordField; index: number }) => (
    <CardAtom
      className={cn(
        'p-4 mb-3 border-l-4 rounded-lg',
        index % 2 === 0 ? 'border-l-accent' : 'border-l-primary'
      )}
    >
      <View className="flex-row justify-between items-center">
        <TypographyParagraph
          testID={`record-item-${item.id}.value`}
          i18nKey="common.raw-value"
          values={{ value: item.value }}
          className="font-semibold text-lg"
        />
        <TypographySmall
          testID={`record-item-${item.id}.date`}
          i18nKey="common.raw-value"
          values={{
            value: format(new Date(item.createdAt), 'dd/MM/yyyy HH:mm'),
          }}
          variant="light"
        />
      </View>
    </CardAtom>
  )
);

const renderItem = ({ item, index }: { item: TRecordField; index: number }) => (
  <RecordItem item={item} index={index} />
);

const ListEmpty = () => (
  <View className="mt-10 items-center">
    <TypographySmall
      testID="page.record-field-list.empty"
      i18nKey="page.summary-detail.empty"
      variant="light"
    />
  </View>
);

export default function RecordFieldListModal() {
  const params = useLocalSearchParams<{
    moduleId: string;
    fieldId: string;
  }>();
  const fieldId = Number(params.fieldId);

  const { loggerAdapter, recordFieldAdapter, notifyAdapter } = useAdapters();

  const { execute, items, isExecuting } = useGetRecordFieldList({
    loggerAdapter,
    recordFieldAdapter,
    notifyAdapter,
  });

  useEffect(() => {
    if (fieldId) {
      void execute({ fieldId });
    }
  }, [fieldId, execute]);

  return (
    <ScreenLayout
      testID="page.record-field-list"
      title="page.report.history"
      isLoading={isExecuting}
    >
      <FlashList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => String(item.id)}
        ListEmptyComponent={!isExecuting ? ListEmpty : null}
      />
    </ScreenLayout>
  );
}
