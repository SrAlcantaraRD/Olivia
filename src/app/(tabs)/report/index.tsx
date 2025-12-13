import React from 'react';
// react imports not required directly here
import { ScrollView, View } from 'react-native';

import { useAdapters } from '@/adapter';
import { BASE_LOGGER } from '@/domain/core/adapter/logger.adapter';
import { TIME_RANGE_VALUES } from '@/domain/core/enum/time-range.enum';
import type { TModule } from '@/domain/module/entity/module.entity';
import type { TRecord } from '@/domain/module/entity/record.entity';
import { useGetRecentRecords } from '@/domain/module/hook/get-recent-records.hook';
import { useNavigation } from '@/hooks/use-navigation.hook';
import {
  getModuleStatisticsData,
  useModuleStatistics,
} from '@/hooks/use-report-manager.hook';
import { CardAtom } from '@/ui/components/atoms/card.atom';
import { SelectableCard } from '@/ui/components/atoms/selectable-card.atom';
import {
  TypographyHeading,
  TypographyParagraph,
  TypographySmall,
} from '@/ui/components/atoms/typography.atom';
import { ScreenLayout } from '@/ui/components/layouts/screen.layout';
import { HistoryRow } from '@/ui/components/molecules/history-row.molecule';
import { StatCardWithTrend } from '@/ui/components/molecules/stat-card-with-trend.molecule';

export default function ReportScreen() {
  const report = useModuleStatistics();
  const { recordAdapter, notifyAdapter, navigationAdapter } = useAdapters();
  const { goToReportHistoryByModule, goToReportHistoryByRecord } =
    useNavigation({ navigationAdapter });
  const recentHook = useGetRecentRecords({
    loggerAdapter: BASE_LOGGER,
    recordAdapter,
    notifyAdapter,
  });

  const [recentRecordList, setRecent] = React.useState<TRecord[]>([]);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      const resp = await recentHook.execute(10);
      if (!mounted) return;
      if (resp.success && resp.data) setRecent(resp.data);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <ScreenLayout
      testID="page.report"
      title="page.report.title"
      subtitle="page.report.subtitle"
    >
      <ScrollView
        className="flex-1"
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-6">
          {/* Range Selector */}
          <View className="flex-row gap-4">
            {TIME_RANGE_VALUES.map((range) => (
              <SelectableCard
                key={`screen.range-select.${range}`}
                testID={`screen.range-select.${range}`}
                isSelected={report.range === range}
                onPress={() => report.setRange(range)}
                className="h-20 w-20 justify-center items-center"
              >
                <TypographyParagraph
                  testID={`screen.range-select.label-${range}`}
                  i18nKey="common.raw-value"
                  values={{ value: range }}
                />
              </SelectableCard>
            ))}
          </View>

          {/* Statistics Cards */}
          <View className="gap-4">
            <TypographyHeading
              testID="page.report.statistics"
              i18nKey="page.report.statistics"
              accessibilityRole="header"
            />

            {/* Dynamic stat cards */}
            {report.visibleModules.map((module: TModule) => {
              const { count, trend } = getModuleStatisticsData(module, report);
              return (
                <View key={`module-${module.id}`} className="gap-4">
                  <StatCardWithTrend
                    module={module}
                    value={count}
                    data={trend}
                    chartVariant="bar"
                    onPress={() => goToReportHistoryByModule(String(module.id))}
                  />
                  <StatCardWithTrend
                    module={module}
                    value={count}
                    data={trend}
                    chartVariant="line"
                    onPress={() => goToReportHistoryByModule(String(module.id))}
                  />
                </View>
              );
            })}
          </View>

          {/* History Section */}
          <View className="gap-4 mt-4">
            <TypographyHeading
              testID="page.report.history"
              i18nKey="page.report.history"
              accessibilityRole="header"
            />

            <CardAtom>
              {recentRecordList.length === 0 ? (
                <TypographySmall
                  testID="page.report.no-history"
                  i18nKey="page.report.no-history"
                  variant="light"
                  className="text-center"
                />
              ) : (
                <View className="gap-4 divide-y divide-default-100 rounded-md overflow-hidden">
                  {recentRecordList.map((recentRecord) => (
                    //TODO: Use a flat-list
                    <HistoryRow
                      key={`screen.report.history-record.${recentRecord.id}`}
                      record={recentRecord}
                      onPress={() =>
                        goToReportHistoryByRecord(String(recentRecord.id))
                      }
                    />
                  ))}
                </View>
              )}
            </CardAtom>
          </View>
        </View>
      </ScrollView>
    </ScreenLayout>
  );
}
