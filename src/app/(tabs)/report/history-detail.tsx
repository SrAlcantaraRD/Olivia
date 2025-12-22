import { useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { useAdapters } from '@/adapter';
import { BASE_LOGGER } from '@/domain/core/adapter/logger.adapter';
import type { TID } from '@/domain/core/schemas/id.schema';
import { useGetListModuleField } from '@/domain/module/hook/get-list-module-field.hook';
import { useGetRecordFieldDistribution } from '@/domain/module/hook/get-record-field-distribution.hook';
import BarChartAtom from '@/ui/components/atoms/bar-chart.atom';
import { CardAtom } from '@/ui/components/atoms/card.atom';
import PieChartAtom from '@/ui/components/atoms/pie-chart.atom';
import {
  TypographyHeading,
  TypographyParagraph,
  TypographySmall,
  TypographyTitle,
} from '@/ui/components/atoms/typography.atom';

export default function HistoryDetailScreen() {
  const { moduleID } = useLocalSearchParams<{ moduleID: string }>();
  const { moduleFieldAdapter, recordAdapter, notifyAdapter, cacheAdapter } =
    useAdapters();

  const { execute: executeGetModuleFieldList, items: fields } =
    useGetListModuleField({
      loggerAdapter: BASE_LOGGER,
      moduleFieldAdapter,
      notifyAdapter,
    });

  const { execute: executeGetDistribution, items: distributionItems } =
    useGetRecordFieldDistribution({
      loggerAdapter: BASE_LOGGER,
      recordAdapter,
      notifyAdapter,
      cacheAdapter,
    });

  const handlerLoadModuleFieldList = async (moduleID: TID) => {
    await executeGetModuleFieldList({ moduleID });
  };

  const [selectedFieldId, setSelectedFieldId] = useState<number | null>(null);
  const [range, setRange] = useState<'30d' | '90d' | '7d' | 'today'>('30d');

  const timeRange: {
    startDate?: Date;
    endDate?: Date;
  } = useMemo(() => {
    const endDate = new Date();
    let startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);
    switch (range) {
      case 'today': {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        startDate = today;
        break;
      }
      case '7d':
        startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(endDate.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
    }
    return { startDate, endDate };
  }, [range]);

  useEffect(() => {
    if (moduleID) handlerLoadModuleFieldList(Number(moduleID));
  }, [moduleID]);

  useEffect(() => {
    if (selectedFieldId) {
      executeGetDistribution({
        fieldID: selectedFieldId,
        moduleID: moduleID ? Number(moduleID) : undefined,
        startDate: timeRange.startDate,
        endDate: timeRange.endDate,
      });
    }
  }, [selectedFieldId, timeRange.startDate, timeRange.endDate]);

  useEffect(() => {
    if (!selectedFieldId && fields && fields.length > 0) {
      setSelectedFieldId(fields[0].id);
    }
  }, [fields]);

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16 }}
        contentInsetAdjustmentBehavior="automatic"
      >
        <View className="gap-6">
          <TypographyTitle
            testID="page.history-detail.title"
            i18nKey="page.history_detail.title"
            accessibilityRole="header"
          />

          <View className="gap-2">
            <TypographyHeading
              testID="page.history-detail.select-field"
              i18nKey="page.history_detail.select_field"
            />
            <View className="flex-row gap-2">
              {(['today', '7d', '30d', '90d'] as const).map((r) => {
                const rangeKey =
                  r === 'today'
                    ? 'page.history_detail.range.today'
                    : r === '7d'
                      ? 'page.history_detail.range.7d'
                      : r === '30d'
                        ? 'page.history_detail.range.30d'
                        : 'page.history_detail.range.90d';

                return (
                  <Pressable
                    key={`range-${r}`}
                    onPress={() => setRange(r)}
                    className={`px-3 py-2 rounded-xl ${range === r ? 'bg-default-100' : 'bg-default-50'}`}
                  >
                    <TypographySmall
                      testID={`page.history-detail.range.${r}`}
                      i18nKey={rangeKey}
                    />
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View className="gap-3">
            <TypographyHeading
              testID="page.history-detail.select-field.secondary"
              i18nKey="page.history_detail.select_field"
            />
            {fields && fields.length > 0 ? (
              <View className="flex-row flex-wrap gap-2">
                {fields.map((f) => (
                  <Pressable
                    key={`field-${f.id}`}
                    onPress={() => setSelectedFieldId(f.id)}
                    accessibilityRole="button"
                    accessibilityLabel={f.title}
                  >
                    <CardAtom
                      className={`p-3 ${selectedFieldId === f.id ? 'bg-default-100' : 'bg-default-50'}`}
                    >
                      <Text style={{ fontSize: 16 }}>{f.title}</Text>
                      <Text style={{ fontSize: 12, color: '#6b7280' }}>
                        {String(f.type)}
                      </Text>
                    </CardAtom>
                  </Pressable>
                ))}
              </View>
            ) : (
              <CardAtom className="p-4 bg-default-100">
                <TypographyParagraph
                  testID="page.history-detail.no-fields"
                  i18nKey="page.history_detail.no_fields"
                />
              </CardAtom>
            )}
          </View>

          <View>
            <TypographyHeading
              testID="page.history-detail.section-title"
              i18nKey="page.history_detail.title"
            />
            {distributionItems && distributionItems.length > 0 ? (
              <CardAtom className="p-4 bg-default-100">
                <PieChartAtom values={distributionItems} />
                <View className="mt-6">
                  <BarChartAtom values={distributionItems} height={180} />
                </View>
                <View className="mt-4">
                  {(() => {
                    const total = distributionItems.reduce(
                      (s, it) => s + it.count,
                      0
                    );
                    const defaultColors = [
                      '#4f46e5',
                      '#f97316',
                      '#22c55e',
                      '#06b6d4',
                      '#ef4444',
                      '#a78bfa',
                      '#f59e0b',
                    ];
                    return distributionItems.map((d, i) => {
                      const pct =
                        total > 0 ? Math.round((d.count / total) * 100) : 0;
                      const color = defaultColors[i % defaultColors.length];
                      return (
                        <View
                          key={`val-${d.value}`}
                          className="flex-row justify-between py-1 items-center"
                          accessibilityRole="text"
                          accessibilityLabel={`${d.value}, ${d.count} (${pct}% )`}
                        >
                          <View className="flex-row gap-2 items-center">
                            <View
                              style={{
                                width: 12,
                                height: 12,
                                borderRadius: 6,
                                backgroundColor: color,
                              }}
                            />
                            <Text style={{ fontSize: 16 }}>{d.value}</Text>
                          </View>
                          <Text style={{ fontSize: 12, color: '#6b7280' }}>
                            {d.count} · {pct}%
                          </Text>
                        </View>
                      );
                    });
                  })()}
                </View>
              </CardAtom>
            ) : (
              <CardAtom className="p-4 bg-default-100">
                <TypographyParagraph
                  testID="page.history-detail.no-data"
                  i18nKey="page.history_detail.no_data"
                />
              </CardAtom>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
