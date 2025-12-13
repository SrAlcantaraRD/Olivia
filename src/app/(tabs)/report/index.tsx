import React from 'react';
// react imports not required directly here
import { ScrollView, View } from 'react-native';

import { useAdapters } from '@/adapter';
import { BASE_LOGGER } from '@/domain/core/adapter/logger.adapter';
import type { TModule } from '@/domain/module/entity/module.entity';
import type { TRecord } from '@/domain/module/entity/record.entity';
import { useGetRecentRecords } from '@/domain/module/hook/get-recent-records.hook';
import { useNavigation } from '@/hooks/use-navigation.hook';
import { useReportManager } from '@/hooks/use-report-manager.hook';
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
  const report = useReportManager();
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

  // Visible modules come from the report manager
  const visibleModules = report.visibleModules;

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
          <View className="gap-2">
            <View className="flex-row justify-between items-center py-4 px-2">
              {/* TODO: convertir en card pequeñas y presionales */}
              {(['today', '7d', '30d', '90d'] as const).map((r) => (
                <SelectableCard
                  key={`report-range-select-${r}`}
                  testID=""
                  isSelected={report.range === r}
                  onPress={() => report.setRange(r)}
                  className="h-20 w-20 justify-center items-center"
                >
                  <TypographyParagraph
                    testID="scree"
                    i18nKey="common.raw-value"
                    values={{ value: r }}
                  />
                </SelectableCard>
              ))}
            </View>
          </View>

          {/* Statistics Cards */}
          {/* FIXME: REFACTORIZAR PARA psar unicaemnte el module */}
          <View className="gap-4">
            <TypographyHeading
              testID="page.report.statistics"
              i18nKey="page.report.statistics"
              accessibilityRole="header"
            />

            {/* Summary cards for each module */}

            {/* Dynamic stat cards */}
            {visibleModules.map((m: TModule) => {
              const moduleId = m.id;
              const item = report.stats?.find((s) => s.moduleID === moduleId);
              const count = item?.count ?? 0;
              const moduleTrend = report.trendByModule[moduleId];
              const numDays =
                Math.floor(
                  (report.timeRange.endDate.getTime() -
                    report.timeRange.startDate.getTime()) /
                    (24 * 60 * 60 * 1000)
                ) + 1;
              const trend = moduleTrend?.length
                ? moduleTrend
                : Array(numDays).fill(0);
              return (
                <>
                  <StatCardWithTrend
                    key={`stat.bar.${moduleId}`}
                    module={m}
                    value={count}
                    data={trend}
                    chartVariant="bar"
                    onPress={() => goToReportHistoryByModule(String(moduleId))}
                  />
                  <StatCardWithTrend
                    key={`stat.line${moduleId}`}
                    module={m}
                    value={count}
                    data={trend}
                    chartVariant="line"
                    onPress={() => goToReportHistoryByModule(String(moduleId))}
                  />
                </>
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
                  i18nKey="page.report.no_history"
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
