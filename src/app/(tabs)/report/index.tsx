import { Link, useRouter } from 'expo-router';
import { useThemeColor } from 'heroui-native';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { useAdapters } from '@/adapter';
import { BASE_LOGGER } from '@/domain/core/adapter/logger.adapter';
import { useGetRecordStatistics } from '@/domain/module/hook/get-record-statistics.hook';
import { useGetRecordTrend } from '@/domain/module/hook/get-record-trend.hook';
import { CardAtom } from '@/ui/components/atoms/card.atom';
import { IconAtom } from '@/ui/components/atoms/icon.atom';
import {
  TypographyHeading,
  TypographyParagraph,
  TypographySmall,
  TypographyTitle,
} from '@/ui/components/atoms/typography.atom';
import StatCardWithTrend from '@/ui/components/molecules/stat-card-with-trend.molecule';

export default function ReportScreen() {
  const foregroundColor = useThemeColor('foreground');
  const { recordAdapter, notifyAdapter } = useAdapters();
  const { execute: executeGetStats, items: stats } = useGetRecordStatistics({
    loggerAdapter: BASE_LOGGER,
    recordAdapter,
    notifyAdapter,
  });

  const { execute: executeGetTrend, items: trendItems } = useGetRecordTrend({
    loggerAdapter: BASE_LOGGER,
    recordAdapter,
    notifyAdapter,
  });

  const router = useRouter();
  const [trendByModule, setTrendByModule] = useState<Record<number, number[]>>(
    {}
  );

  const [range, setRange] = useState<'today' | '7d' | '30d' | '90d'>('7d');
  const timeRange = useMemo(() => {
    const end = Math.floor(Date.now() / 1000);
    let start = end - 7 * 24 * 60 * 60;
    switch (range) {
      case 'today': {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        start = Math.floor(today.getTime() / 1000);
        break;
      }
      case '7d':
        start = end - 7 * 24 * 60 * 60;
        break;
      case '30d':
        start = end - 30 * 24 * 60 * 60;
        break;
      case '90d':
        start = end - 90 * 24 * 60 * 60;
        break;
    }
    return { start, end };
  }, [range]);

  useEffect(() => {
    let mounted = true;

    executeGetStats({ start: timeRange.start, end: timeRange.end });
    // fetch global trend
    executeGetTrend({ start: timeRange.start, end: timeRange.end });

    // fetch per-module trends in parallel
    (async () => {
      try {
        const entries: Record<number, number[]> = {};

        await Promise.all(
          STAT_MODULES.map(async (m) => {
            try {
              const res = await executeGetTrend({
                start: timeRange.start,
                end: timeRange.end,
                moduleID: m.moduleID,
              });
              const series = (res?.data ?? []) as {
                day: string;
                count: number;
              }[];
              const numDays =
                Math.floor((timeRange.end - timeRange.start) / (24 * 60 * 60)) +
                1;
              const dayMap: Record<string, number> = {};
              series.forEach((s) => {
                dayMap[s.day] = s.count;
              });
              const counts = Array.from({ length: numDays }, (_, i) => {
                const ts = (timeRange.start + i * 24 * 60 * 60) * 1000;
                const day = new Date(ts).toISOString().slice(0, 10);
                return dayMap[day] ?? 0;
              });
              entries[m.moduleID] = counts;
            } catch (err) {
              // on error, fallback to generated data
              entries[m.moduleID] = Array.from({ length: 7 }, () =>
                Math.floor(Math.random() * 5)
              );
            }
          })
        );

        if (mounted) setTrendByModule(entries);
      } catch (err) {
        // ignore
      }
    })();

    return () => {
      mounted = false;
    };
  }, [timeRange.start, timeRange.end]);

  const STAT_MODULES = [
    {
      moduleID: 1,
      icon: 'water',
      titleKey: 'component.stat_card.cic_label',
      color: '#4f46e5',
    },
    {
      moduleID: 2,
      icon: 'nutrition',
      titleKey: 'component.stat_card.stool_label',
      color: '#f97316',
    },
    {
      moduleID: 3,
      icon: 'medical',
      titleKey: 'component.stat_card.medication_label',
      color: '#22c55e',
    },
  ];

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16 }}
        contentInsetAdjustmentBehavior="automatic"
      >
        <View className="gap-6">
          {/* Header */}
          <View className="gap-2">
            <TypographyTitle
              i18nKey="page.report.title"
              accessibilityRole="header"
            />
            <TypographySmall i18nKey="page.report.subtitle" variant="light" />
          </View>

          {/* Filter Section */}
          <View className="gap-4">
            <TypographyHeading
              i18nKey="page.report.filters"
              accessibilityRole="header"
            />

            <Link href="/(modals)/modal-filter-history" asChild>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="a11y.button.open_filters"
                accessibilityHint="a11y.hint.opens_filter_modal"
              >
                <CardAtom className="flex-row items-center gap-3 p-4 bg-default-100">
                  <IconAtom name="filter" />
                  <TypographyParagraph
                    i18nKey="component.filter_button.label"
                    className="font-medium flex-1"
                  />
                  <TypographySmall
                    i18nKey="component.filter_button.all_types"
                    variant="light"
                  />
                </CardAtom>
              </Pressable>
            </Link>
          </View>

          {/* Range Selector */}
          <View className="gap-2">
            <View className="flex-row gap-2">
              {(['today', '7d', '30d', '90d'] as const).map((r) => (
                <Pressable
                  key={`range-${r}`}
                  onPress={() => setRange(r)}
                  className={`px-3 py-2 rounded-xl ${range === r ? 'bg-default-100' : 'bg-default-50'}`}
                >
                  <Text className="text-sm">{r}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Statistics Cards */}
          <View className="gap-4">
            <TypographyHeading
              i18nKey="page.report.statistics"
              accessibilityRole="header"
            />

            {/* Dynamic stat cards */}
            {STAT_MODULES.map((m) => {
              const item = stats?.find((s) => s.moduleID === m.moduleID);
              const count = item?.count ?? 0;
              const moduleTrend = trendByModule[m.moduleID];
              const trend = moduleTrend?.length
                ? moduleTrend
                : Array.from({ length: 7 }, () =>
                    Math.floor(Math.random() * 5)
                  );
              return (
                <StatCardWithTrend
                  key={`stat-${m.moduleID}`}
                  titleKey={m.titleKey}
                  value={count}
                  data={trend}
                  color={m.color}
                  iconName={m.icon}
                  onPress={() =>
                    router.push({
                      pathname: '/(tabs)/report/history-detail',
                      params: { moduleId: String(m.moduleID) },
                    })
                  }
                />
              );
            })}
          </View>

          {/* History Section */}
          <View className="gap-4 mt-4">
            <TypographyHeading
              i18nKey="page.report.history"
              accessibilityRole="header"
            />

            <CardAtom className="p-4 bg-default-100">
              <TypographySmall
                i18nKey="page.report.no_history"
                variant="light"
                className="text-center"
              />
            </CardAtom>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
