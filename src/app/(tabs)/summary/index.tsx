import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';

import { useAdapters } from '@/adapter';
import { BASE_LOGGER } from '@/domain/core/adapter/logger.adapter';
import { useGetListActiveModule } from '@/domain/module/hook/get-list-active-module.hook';
import type { TRequestGetActiveModuleList } from '@/domain/module/use-case-schema/get-active-module-list.use-case-schema';
import { SUMMARY_PIN_TYPE_ENUM } from '@/domain/summary/enum/summary-pin-type.enum';
import { useGetSummaryHome } from '@/domain/summary/hook/get-summary-home.hook';
import { useNavigation } from '@/hooks/use-navigation.hook';
import { ScreenLayout } from '@/ui/components/layouts/screen.layout';
import { SummaryCard } from '@/ui/components/molecules/summary-card.molecule';
import { SummaryRow } from '@/ui/components/molecules/summary-row.molecule';
import { SummarySectionHeader } from '@/ui/components/molecules/summary-section-header.molecule';

export default function SummaryHomeScreen() {
  const { t } = useTranslation();
  const {
    moduleAdapter,
    summaryModuleAdapter,
    summaryPinsAdapter,
    notifyAdapter,
    navigationAdapter,
  } = useAdapters();

  const {
    goToSummaryAllData,
    goToSummaryHighlights,
    goToSummaryModuleDetail,
    goToSummaryTrends,
  } = useNavigation({ navigationAdapter });

  const activeModuleHook = useGetListActiveModule({
    loggerAdapter: BASE_LOGGER,
    moduleAdapter,
    notifyAdapter,
  });

  const summaryHomeHook = useGetSummaryHome({
    loggerAdapter: BASE_LOGGER,
    summaryModuleAdapter,
    summaryPinsAdapter,
    notifyAdapter,
  });

  React.useEffect(() => {
    void activeModuleHook.execute(undefined as TRequestGetActiveModuleList);
  }, []);

  React.useEffect(() => {
    const moduleIds = activeModuleHook.items.map((module) => module.id);
    void summaryHomeHook.execute({ moduleIds });
  }, [activeModuleHook.items.length]);

  const { modules, pins } = summaryHomeHook.items;
  const pinnedModuleIds = pins
    .filter((pin) => pin.type === SUMMARY_PIN_TYPE_ENUM.MODULE)
    .map((pin) => Number(pin.targetId));
  const pinnedModules =
    pinnedModuleIds.length > 0
      ? modules.filter((module) => pinnedModuleIds.includes(module.moduleId))
      : modules.slice(0, 1);

  const getTimeLabel = (dateValue: string | null) => {
    if (!dateValue) return '';
    const date = new Date(dateValue);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const getModuleIcon = (key: string) => {
    switch (key) {
      case 'URINE':
        return 'water';
      case 'STOOL':
        return 'nutrition';
      case 'MEDICATION':
        return 'medical';
      case 'ENEMA':
        return 'flame';
      default:
        return 'flame';
    }
  };

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
      >
        <View className="gap-6">
          {pinnedModules.length === 0 ? (
            <SummaryRow
              iconName="add-circle"
              titleKey="page.summary.pins-empty"
              onPress={goToSummaryAllData}
              testID="page.summary.pins-empty"
            />
          ) : (
            pinnedModules.map((module) => (
              <SummaryCard
                highlightLastBar
                key={`summary-pinned-module-${module.moduleId}`}
                title={String(module.moduleKey)}
                metricValue={module.todayCount}
                metricLabel={t('page.summary.metric-label.today')}
                timeLabel={getTimeLabel(module.lastRecordedAt)}
                iconName={getModuleIcon(String(module.moduleKey))}
                chartValues={module.last7Days.map((item) => item.value)}
                chartAverage={module.previousPeriodAverage ?? null}
                onPress={() => goToSummaryModuleDetail(String(module.moduleId))}
                testID={`page.summary.pinned.${module.moduleId}`}
              />
            ))
          )}

          <View className="gap-2">
            <SummaryRow
              iconName="heart"
              titleKey="page.summary.all-data"
              onPress={goToSummaryAllData}
              testID="page.summary.all-data"
            />
            <SummaryRow
              iconName="trending-up"
              titleKey="page.summary.trends"
              onPress={goToSummaryTrends}
              testID="page.summary.trends"
            />
            <SummaryRow
              iconName="sparkles"
              titleKey="page.summary.highlights"
              onPress={goToSummaryHighlights}
              testID="page.summary.highlights"
            />
          </View>

          <View className="gap-3">
            <SummarySectionHeader
              titleKey="page.summary.section.modules"
              testID="page.summary.modules"
            />
            {modules.length === 0 ? (
              <SummaryRow
                iconName="alert"
                titleKey="page.summary.modules-empty"
                onPress={goToSummaryAllData}
                testID="page.summary.modules-empty"
              />
            ) : (
              modules.map((module) => (
                <SummaryCard
                  key={`summary-module-${module.moduleId}`}
                  title={String(module.moduleKey)}
                  metricValue={module.todayCount}
                  metricLabel={t('page.summary.metric-label.today')}
                  timeLabel={getTimeLabel(module.lastRecordedAt)}
                  iconName={getModuleIcon(String(module.moduleKey))}
                  chartValues={module.last7Days.map((item) => item.value)}
                  chartAverage={module.previousPeriodAverage ?? null}
                  onPress={() =>
                    goToSummaryModuleDetail(String(module.moduleId))
                  }
                  testID={`page.summary.module.${module.moduleId}`}
                />
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </ScreenLayout>
  );
}
