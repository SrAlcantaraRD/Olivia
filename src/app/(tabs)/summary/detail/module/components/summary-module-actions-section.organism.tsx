import { useCallback, useEffect } from 'react';
import { View } from 'react-native';

import { useAdapters } from '@/adapter';
import { SUMMARY_PIN_TYPE_ENUM } from '@/domain/summary/enum/summary-pin-type.enum';
import { useGetSummaryPins } from '@/domain/summary/hook/get-summary-pins.hook';
import { usePinSummaryItem } from '@/domain/summary/hook/pin-summary-item.hook';
import { useUnpinSummaryItem } from '@/domain/summary/hook/unpin-summary-item.hook';
import { RowAction } from '@/ui/components/molecules/row-action.molecule';
import { SummarySectionHeader } from '@/ui/components/molecules/summary-section-header.molecule';

interface SummaryModuleActionsSectionProps {
  moduleID: number;
  testID: string;
}

export const SummaryModuleActionsSection = ({
  moduleID,
  testID,
}: SummaryModuleActionsSectionProps) => {
  const { summaryPinsAdapter, notifyAdapter, loggerAdapter } = useAdapters();

  const { execute: loadPins, items: pins } = useGetSummaryPins({
    loggerAdapter,
    summaryPinsAdapter,
    notifyAdapter,
  });

  const { execute: pinItem } = usePinSummaryItem({
    loggerAdapter,
    summaryPinsAdapter,
    notifyAdapter,
  });

  const { execute: unpinItem } = useUnpinSummaryItem({
    loggerAdapter,
    summaryPinsAdapter,
    notifyAdapter,
  });

  useEffect(() => {
    loadPins();
  }, []);

  const isPinned = pins.some(
    (pin) =>
      pin.type === SUMMARY_PIN_TYPE_ENUM.MODULE &&
      pin.targetId === String(moduleID)
  );

  const handlePinToggle = useCallback(async () => {
    if (isPinned) {
      await unpinItem({
        type: SUMMARY_PIN_TYPE_ENUM.MODULE,
        targetId: String(moduleID),
      });
      return;
    }

    await pinItem({
      type: SUMMARY_PIN_TYPE_ENUM.MODULE,
      targetId: String(moduleID),
    });
  }, [isPinned, moduleID, pinItem, unpinItem]);

  return (
    <View className="gap-2" testID={testID}>
      <SummarySectionHeader
        titleKey="page.summary-detail.actions"
        testID={`${testID}.header`}
      />
      <RowAction
        iconName={isPinned ? 'bookmark' : 'bookmark-outline'}
        title={
          isPinned ? 'page.summary-detail.unpin' : 'page.summary-detail.pin'
        }
        onPress={handlePinToggle}
        testID={`${testID}.pin-toggle`}
      />
    </View>
  );
};
