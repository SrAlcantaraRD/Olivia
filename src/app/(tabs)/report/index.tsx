import { useRouter } from 'expo-router';
// react imports not required directly here
import { Pressable, ScrollView, Text, View } from 'react-native';

import type { TModule } from '@/domain/module/entity/module.entity';
import { useReportManager } from '@/hooks/use-report-manager.hook';
import { CardAtom } from '@/ui/components/atoms/card.atom';
import type { IconName } from '@/ui/components/atoms/icon.atom';
import {
  TypographyHeading,
  TypographySmall,
  TypographyTitle,
} from '@/ui/components/atoms/typography.atom';
import { ScreenLayout } from '@/ui/components/layouts/screen.layout';
import { StatCardWithTrend } from '@/ui/components/molecules/stat-card-with-trend.molecule';

export default function ReportScreen() {
  const report = useReportManager();

  const router = useRouter();

  const MODULE_META: Record<number, { icon?: string; color?: string }> = {
    1: { icon: 'water', color: '#4f46e5' },
    2: { icon: 'nutrition', color: '#f97316' },
    3: { icon: 'medical', color: '#22c55e' },
  };

  // Visible modules come from the report manager
  const visibleModules = report.visibleModules;

  return (
    <ScreenLayout testID="page.report">
      <ScrollView className="flex-1" contentInsetAdjustmentBehavior="automatic">
        <View className="gap-6">
          {/* Header */}
          <View className="gap-2">
            <TypographyTitle
              testID="page.report.title"
              i18nKey="page.report.title"
              accessibilityRole="header"
            />
            <TypographySmall
              testID="page.report.subtitle"
              i18nKey="page.report.subtitle"
              variant="light"
            />
          </View>

          {/* Filter Section */}
          <View className="gap-4">
            <TypographyHeading
              testID="page.report.filters"
              i18nKey="page.report.filters"
              accessibilityRole="header"
            />
          </View>

          {/* Range Selector */}
          <View className="gap-2">
            <View className="flex-row gap-2">
              {(['today', '7d', '30d', '90d'] as const).map((r) => (
                <Pressable
                  key={`range-${r}`}
                  onPress={() => report.setRange(r)}
                  className={`px-3 py-2 rounded-xl ${report.range === r ? 'bg-default-100' : 'bg-default-50'}`}
                >
                  <Text className="text-sm">{r}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Statistics Cards */}
          <View className="gap-4">
            <TypographyHeading
              testID="page.report.statistics"
              i18nKey="page.report.statistics"
              accessibilityRole="header"
            />

            {/* DEBUG: show raw fetched items for troubleshooting */}
            <CardAtom className="p-3 bg-default-50">
              <TypographySmall
                testID="page.report.debug-stats"
                variant="light"
                i18nKey={'page.report.debug_stats'}
              />
              <Text style={{ fontSize: 12 }} selectable>
                {JSON.stringify(report.stats ?? [], null, 2)}
              </Text>
              <TypographySmall
                variant="light"
                testID="page.report.debug-trendItems"
                i18nKey={'page.report.debug_trendItems'}
              />
              <Text style={{ fontSize: 12 }} selectable>
                {JSON.stringify(report.globalTrend ?? [], null, 2)}
              </Text>
            </CardAtom>

            {/* Dynamic stat cards */}
            {visibleModules.map((m: TModule) => {
              const moduleId = m.id;
              const item = report.stats?.find((s) => s.moduleID === moduleId);
              const count = item?.count ?? 0;
              const moduleTrend = report.trendByModule[moduleId];
              const trend = moduleTrend?.length
                ? moduleTrend
                : Array.from({ length: 7 }, () =>
                    Math.floor(Math.random() * 5)
                  );
              return (
                <StatCardWithTrend
                  key={`stat-${moduleId}`}
                  titleKey={
                    (m.code
                      ? `component.stat_card.${String(m.code).toLowerCase()}_label`
                      : (m.name ??
                        '')) as unknown as import('@/ui/i18n/locales/en-EN').Ti18nKeys
                  }
                  value={count}
                  data={trend}
                  color={MODULE_META[moduleId]?.color}
                  iconName={MODULE_META[moduleId]?.icon as unknown as IconName}
                  onPress={() =>
                    router.push({
                      pathname: '/(tabs)/report/history-detail',
                      params: { moduleId: String(moduleId) },
                    })
                  }
                />
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

            <CardAtom className="p-3 bg-default-50">
              <TypographySmall
                testID="page.report.no-history"
                i18nKey="page.report.no_history"
                variant="light"
                className="text-center"
              />
            </CardAtom>
          </View>
        </View>
      </ScrollView>
    </ScreenLayout>
  );
}
