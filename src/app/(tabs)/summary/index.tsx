import { useCallback } from 'react';
import { ScrollView, View } from 'react-native';
import { RefreshControl } from 'react-native-gesture-handler';

import { useAdapters } from '@/adapter';
import { SUMMARY_PERIOD_ENUM } from '@/domain/summary/enum/summary-period.enum';
import { useGetSummaryModuleDetailByPeriod } from '@/domain/summary/hook/use-get-summary-module-detail-by-period.hook';
import { useGetSummaryModuleListByPeriod } from '@/domain/summary/hook/use-get-summary-module-list-by-period.hook';
import { RowEmptyAtom } from '@/ui/components/atoms/row-empty.atom';
import { ScreenLayout } from '@/ui/components/layouts/screen.layout';
import { RowAction } from '@/ui/components/molecules/row-action.molecule';
import { SummarySectionHeader } from '@/ui/components/molecules/summary-section-header.molecule';
import { ModulesSection } from '@/ui/components/organisms/modules-section.organism';

export default function SummaryHomeScreen() {
  const {
    loggerAdapter,
    notifyAdapter,
    cacheAdapter,
    summaryModuleAdapter,
    summaryModuleFieldAdapter,
  } = useAdapters();

  const {
    execute: executeSummaryModule,
    isExecuting: isRefreshingModuleDetails,
  } = useGetSummaryModuleDetailByPeriod({
    loggerAdapter,
    notifyAdapter,
    cacheAdapter,
    summaryModuleAdapter,
    summaryModuleFieldAdapter,
  });

  const {
    items: summaryModuleList,
    isExecuting: isRefreshingModuleList,
    execute: loadSummaryModuleList,
  } = useGetSummaryModuleListByPeriod({
    loggerAdapter,
    notifyAdapter,
    cacheAdapter,
    summaryModuleAdapter,
  });

  const handleRefresh = useCallback(async () => {
    await Promise.all(
      summaryModuleList.map((module) =>
        executeSummaryModule(
          {
            period: SUMMARY_PERIOD_ENUM.WEEK,
            moduleID: module.metadata.module.id,
          },
          true
        )
      )
    );

    await loadSummaryModuleList({ period: SUMMARY_PERIOD_ENUM.WEEK });
    // const activeModules = activeModuleHook.items?.map((m) => m.id) ?? [];
    // await executeSummaryRefresh({ moduleIds: [] });
    // Re-fetch home data
    // await summaryHomeHook.execute({ moduleIds: activeModules });
  }, []);

  const isRefreshing = isRefreshingModuleList || isRefreshingModuleDetails;

  return (
    <ScreenLayout
      testID="page.summary"
      title="page.summary.title"
      subtitle="page.summary.subtitle"
    >
      <ScrollView
        className="flex-1"
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
      >
        <View className="gap-4">
          <ModulesSection testID="page.summary.modules" />

          <View className="gap-2">
            <SummarySectionHeader
              titleKey="page.summary.section.can-interest-you"
              testID="page.summary.section.can-interest-you"
            />

            <RowAction
              iconName="heart"
              title="page.summary.all-data"
              onPress={() => {}}
              testID="page.summary.all-data"
            />

            <RowAction
              iconName="trending-up"
              title="page.summary.trends"
              onPress={() => {}}
              testID="page.summary.trends"
            />

            <RowAction
              iconName="sparkles"
              title="page.summary.highlights"
              onPress={() => {}}
              testID="page.summary.highlights"
            />
          </View>
        </View>

        <RowEmptyAtom />
      </ScrollView>
    </ScreenLayout>
  );
}
