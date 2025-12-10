import { useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import { useAdapters } from '@/adapter';
import { BASE_LOGGER } from '@/domain/core/adapter/logger.adapter';
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
  const params = useLocalSearchParams() as Record<string, string | undefined>;
  const moduleId = Number(params.moduleId ?? 0);
  const { moduleFieldAdapter, recordAdapter, notifyAdapter, cacheAdapter } =
    useAdapters();

  const { execute: executeGetFields, items: fields } = useGetListModuleField({
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

  const [selectedFieldId, setSelectedFieldId] = useState<number | null>(null);
  const [range, setRange] = useState<'30d' | '90d' | '7d' | 'today'>('30d');

  const timeRange = useMemo(() => {
    const end = Math.floor(Date.now() / 1000);
    let start = end - 30 * 24 * 60 * 60;
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
    if (moduleId > 0) executeGetFields({ moduleId });
  }, [moduleId]);

  useEffect(() => {
    if (selectedFieldId) {
      executeGetDistribution({
        fieldID: selectedFieldId,
        moduleID: moduleId || undefined,
        start: timeRange.start,
        end: timeRange.end,
      });
    }
  }, [selectedFieldId, timeRange.start, timeRange.end]);

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
            i18nKey="page.history_detail.title"
            accessibilityRole="header"
          />

          <View className="gap-2">
            <TypographyHeading i18nKey="page.history_detail.select_field" />
            <View className="flex-row gap-2">
              {(['today', '7d', '30d', '90d'] as const).map((r) => (
                <Pressable
                  key={`range-${r}`}
                  onPress={() => setRange(r)}
                  className={`px-3 py-2 rounded-xl ${range === r ? 'bg-default-100' : 'bg-default-50'}`}
                >
                  <TypographySmall>{r}</TypographySmall>
                </Pressable>
              ))}
            </View>
          </View>

          <View className="gap-3">
            <TypographyHeading i18nKey="page.history_detail.select_field" />
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
                      <TypographyParagraph>{f.title}</TypographyParagraph>
                      <TypographySmall variant="light">
                        {f.type}
                      </TypographySmall>
                    </CardAtom>
                  </Pressable>
                ))}
              </View>
            ) : (
              <CardAtom className="p-4 bg-default-100">
                <TypographyParagraph i18nKey="page.history_detail.no_fields" />
              </CardAtom>
            )}
          </View>

          <View>
            <TypographyHeading i18nKey="page.history_detail.title" />
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
                          accessibilityRole="listitem"
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
                            <TypographyParagraph>{d.value}</TypographyParagraph>
                          </View>
                          <TypographySmall variant="light">
                            {d.count} · {pct}%
                          </TypographySmall>
                        </View>
                      );
                    });
                  })()}
                </View>
              </CardAtom>
            ) : (
              <CardAtom className="p-4 bg-default-100">
                <TypographyParagraph i18nKey="page.history_detail.no_data" />
              </CardAtom>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
