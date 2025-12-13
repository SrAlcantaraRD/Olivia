import { useLocalSearchParams } from 'expo-router';
import { useThemeColor } from 'heroui-native';
import { useEffect, useMemo, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { useAdapters } from '@/adapter';
import { BASE_LOGGER } from '@/domain/core/adapter/logger.adapter';
import {
  TIME_RANGE_ENUM,
  TIME_RANGE_I18N_MAP,
  TIME_RANGE_VALUES,
} from '@/domain/core/enum/time-range.enum';
import type { TID } from '@/domain/core/schemas/id.schema';
import { useGetListModuleField } from '@/domain/module/hook/get-list-module-field.hook';
import { useGetRecordFieldDistribution } from '@/domain/module/hook/get-record-field-distribution.hook';
import { computeTimeRange } from '@/hooks/use-report-manager.hook';
import { BarChartAtom } from '@/ui/components/atoms/bar-chart.atom';
import { CardAtom } from '@/ui/components/atoms/card.atom';
import PieChartAtom from '@/ui/components/atoms/pie-chart.atom';
import { SelectableCard } from '@/ui/components/atoms/selectable-card.atom';
import {
  TypographyHeading,
  TypographyParagraph,
  TypographySmall,
} from '@/ui/components/atoms/typography.atom';
import { ScreenLayout } from '@/ui/components/layouts/screen.layout';

export default function HistoryDetailScreen() {
  const { moduleId, moduleID } = useLocalSearchParams<{
    moduleId?: string;
    moduleID?: string;
  }>();
  const { moduleFieldAdapter, recordAdapter, notifyAdapter, cacheAdapter } =
    useAdapters();

  const foregroundColor = useThemeColor('foreground');
  const mutedColor = useThemeColor('muted');

  const {
    execute: executeGetModuleFieldList,
    items: fields,
    isExecuting: isLoadingFields,
  } = useGetListModuleField({
    loggerAdapter: BASE_LOGGER,
    moduleFieldAdapter,
    notifyAdapter,
  });

  const {
    execute: executeGetDistribution,
    items: distributionItems,
    isExecuting: isLoadingDistribution,
  } = useGetRecordFieldDistribution({
    loggerAdapter: BASE_LOGGER,
    recordAdapter,
    notifyAdapter,
    cacheAdapter,
  });

  const moduleIdValue: TID | null = useMemo(() => {
    const raw = moduleId ?? moduleID;
    if (!raw) return null;
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : null;
  }, [moduleId, moduleID]);

  const [selectedFieldId, setSelectedFieldId] = useState<number | null>(null);
  const [range, setRange] = useState<TIME_RANGE_ENUM>(
    TIME_RANGE_ENUM.MONTH_30D
  );

  const timeRange = useMemo(() => computeTimeRange(range), [range]);

  useEffect(() => {
    if (moduleIdValue === null) return;
    void executeGetModuleFieldList({ moduleID: moduleIdValue });
  }, [executeGetModuleFieldList, moduleIdValue]);

  useEffect(() => {
    if (selectedFieldId === null) return;
    if (moduleIdValue === null) return;
    void executeGetDistribution({
      fieldID: selectedFieldId,
      moduleID: moduleIdValue,
      startDate: timeRange.startDate,
      endDate: timeRange.endDate,
    });
  }, [
    executeGetDistribution,
    moduleIdValue,
    selectedFieldId,
    timeRange.startDate,
    timeRange.endDate,
  ]);

  useEffect(() => {
    if (selectedFieldId !== null) return;
    if (!fields || fields.length === 0) return;
    setSelectedFieldId(fields[0].id);
  }, [fields, selectedFieldId]);

  return (
    <ScreenLayout
      testID="screen.history-detail"
      title="page.history-detail.title"
      subtitle="page.history-detail.subtitle"
    >
      <ScrollView
        className="flex-1"
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-6">
          <View className="gap-2">
            <TypographyHeading
              testID="page.history-detail.select-field"
              i18nKey="page.history-detail.select-field"
            />
            <View className="flex-row gap-2">
              {TIME_RANGE_VALUES.map((_range) => (
                <SelectableCard
                  key={`range-${_range}`}
                  isSelected={range === _range}
                  onPress={() => setRange(_range)}
                  testID={`page.history-detail.range.${_range}`}
                  className="px-3 py-2"
                >
                  <TypographySmall
                    testID={`page.history-detail.range.${_range}.label`}
                    i18nKey={TIME_RANGE_I18N_MAP[_range]}
                  />
                </SelectableCard>
              ))}
            </View>
          </View>

          <View className="gap-3">
            <TypographyHeading
              testID="page.history-detail.select-field.secondary"
              i18nKey="page.history-detail.select-field"
            />
            {isLoadingFields ? (
              <CardAtom className="p-4 bg-default-100">
                <TypographyParagraph
                  testID="page.history-detail.fields.loading"
                  i18nKey="common.loading"
                />
              </CardAtom>
            ) : fields && fields.length > 0 ? (
              <View className="flex-row flex-wrap gap-2">
                {fields.map((f) => (
                  <SelectableCard
                    key={`field-${f.id}`}
                    isSelected={selectedFieldId === f.id}
                    onPress={() => setSelectedFieldId(f.id)}
                    testID={`page.history-detail.field.${f.id}`}
                    className="p-3"
                  >
                    <TypographyParagraph
                      testID=""
                      i18nKey="common.raw-value"
                      values={{
                        value: f.title,
                      }}
                    />
                  </SelectableCard>
                ))}
              </View>
            ) : (
              <CardAtom className="p-4 bg-default-100">
                <TypographyParagraph
                  testID="page.history-detail.no-fields"
                  i18nKey="page.history-detail.no-fields"
                />
              </CardAtom>
            )}
          </View>

          <View>
            <TypographyHeading
              testID="page.history-detail.section-title"
              i18nKey="page.history-detail.title"
            />
            {isLoadingDistribution ? (
              <CardAtom className="p-4 bg-default-100">
                <TypographyParagraph
                  testID="page.history-detail.distribution.loading"
                  i18nKey="common.loading"
                />
              </CardAtom>
            ) : distributionItems && distributionItems.length > 0 ? (
              <CardAtom className="p-4 bg-default-100">
                <PieChartAtom values={distributionItems} />
                <View className="mt-6">
                  <BarChartAtom
                    values={distributionItems}
                    testID="page.history-detail.distribution.bar-chart"
                  />
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
                            <Text
                              style={{ fontSize: 16, color: foregroundColor }}
                            >
                              {d.value}
                            </Text>
                          </View>
                          <Text style={{ fontSize: 12, color: mutedColor }}>
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
                  i18nKey="page.history-detail.no-data"
                />
              </CardAtom>
            )}
          </View>
        </View>
      </ScrollView>
    </ScreenLayout>
  );
}
