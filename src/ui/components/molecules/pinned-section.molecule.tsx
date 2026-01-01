import { useEffect } from 'react';
import { View } from 'react-native';

import { useAdapters } from '@/adapter';
import type { TSummaryModule } from '@/domain/summary/entity/summary-module.entity';
import { useGetSummaryPins } from '@/domain/summary/hook/get-summary-pins.hook';
import { RowAction } from '@/ui/components/molecules/row-action.molecule';
import { SummaryModuleCard } from '@/ui/components/molecules/summary-card.module-field.molecule';
import { SummarySectionHeader } from '@/ui/components/molecules/summary-section-header.molecule';
import { useNavigation } from '@/ui/hook/use-navigation.hook';

interface PinnedSectionProps {
  testID: string;
}

export const PinnedSection: React.FC<PinnedSectionProps> = ({ testID }) => {
  const {
    summaryPinsAdapter,
    notifyAdapter,
    loggerAdapter,
    navigationAdapter,
    // moduleAdapter,
    // moduleFieldAdapter,
    // recordFieldAdapter,
    // recordAdapter,
  } = useAdapters();

  const { goToSummaryAllData, goToSummaryModuleDetail } = useNavigation({
    navigationAdapter,
  });

  const { execute: loadPinnedSummaryPins, items: summaryPinList } =
    useGetSummaryPins({
      loggerAdapter,
      summaryPinsAdapter,
      notifyAdapter,
    });

  // const pinnedModuleIds = useMemo(
  //   () =>
  //     summaryPinList
  //       .filter((pin) => pin.type === SUMMARY_PIN_TYPE_ENUM.MODULE)
  //       .map((pin) => Number(pin.targetId)),
  //   [summaryPinList]
  // );

  // const { execute, isExecuting, items } = useGetSummaryModuleListByPeriod({
  //   loggerAdapter,
  //   notifyAdapter,
  //   moduleAdapter,
  //   moduleFieldAdapter,
  //   recordFieldAdapter,
  //   recordAdapter,
  // });

  const handleLoadData = async () => {
    await loadPinnedSummaryPins();
  };

  useEffect(() => {
    handleLoadData();
  }, []);

  const pinnedSummaries: TSummaryModule[] = [];

  loggerAdapter.debug(
    `PinnedSection: summaryPinList length = ${summaryPinList.length}`
  );

  return (
    <View className="gap-4">
      <SummarySectionHeader
        titleKey="page.summary.section.pinned"
        actionKey={pinnedSummaries.length > 0 ? 'common.edit' : undefined}
        onActionPress={() => {}}
        testID={testID}
      />

      {pinnedSummaries.length === 0 ? (
        <RowAction
          iconName="add-circle"
          title="page.summary.pins-empty"
          onPress={goToSummaryAllData}
          testID="page.summary.pins-empty"
        />
      ) : (
        pinnedSummaries.map((summary) => (
          <SummaryModuleCard
            summary={summary}
            highlightLastBar
            key={`summary-pinned-module-${summary.module.id}`}
            onPress={() => goToSummaryModuleDetail(String(summary.module.id))}
            testID={`${testID}.${summary.module.id}`}
          />
        ))
      )}
    </View>
  );
};
