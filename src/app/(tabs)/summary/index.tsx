import React from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import { useAdapters } from '@/adapter';
import { BASE_LOGGER } from '@/domain/core/adapter/logger.adapter';
import { useGetListActiveModule } from '@/domain/module/hook/get-list-active-module.hook';
import type { TRequestGetActiveModuleList } from '@/domain/module/use-case-schema/get-active-module-list.use-case-schema';
import { useGetSummaryHome } from '@/domain/summary/hook/get-summary-home.hook';
import { useNavigation } from '@/hooks/use-navigation.hook';
import { CardAtom } from '@/ui/components/atoms/card.atom';
import {
  TypographyHeading,
  TypographyParagraph,
  TypographySmall,
} from '@/ui/components/atoms/typography.atom';
import { ScreenLayout } from '@/ui/components/layouts/screen.layout';
import { SettingsRow } from '@/ui/components/molecules/settings-row.molecule';

export default function SummaryHomeScreen() {
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
          <View className="gap-3">
            <TypographyHeading
              testID="page.summary.pinned"
              i18nKey="page.summary.section.pinned"
              accessibilityRole="header"
            />
            {pins.length === 0 ? (
              <CardAtom>
                <TypographySmall
                  i18nKey="page.summary.pins-empty"
                  testID="page.summary.pins-empty"
                  variant="light"
                />
              </CardAtom>
            ) : (
              <CardAtom>
                <TypographyParagraph
                  i18nKey="common.raw-value"
                  values={{ value: pins.length }}
                  testID="page.summary.pins-count"
                />
              </CardAtom>
            )}
          </View>

          <View className="gap-2">
            <SettingsRow
              iconName="list"
              titleKey="page.summary.all-data"
              onPress={goToSummaryAllData}
              testID="page.summary.all-data"
            />
            <SettingsRow
              iconName="trending-up"
              titleKey="page.summary.trends"
              onPress={goToSummaryTrends}
              testID="page.summary.trends"
            />
            <SettingsRow
              iconName="sparkles"
              titleKey="page.summary.highlights"
              onPress={goToSummaryHighlights}
              testID="page.summary.highlights"
            />
          </View>

          <View className="gap-3">
            <TypographyHeading
              testID="page.summary.modules"
              i18nKey="page.summary.section.modules"
              accessibilityRole="header"
            />
            {modules.length === 0 ? (
              <CardAtom>
                <TypographySmall
                  i18nKey="page.summary.modules-empty"
                  testID="page.summary.modules-empty"
                  variant="light"
                />
              </CardAtom>
            ) : (
              modules.map((module) => (
                <CardAtom key={`summary-module-${module.moduleId}`}>
                    <Pressable
                      accessibilityRole="button"
                      onPress={() => goToSummaryModuleDetail(String(module.moduleId))}
                      style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
                    >
                    <View className="gap-1">
                      <TypographyParagraph
                        i18nKey="common.raw-value"
                        values={{ value: module.moduleKey }}
                        testID={`page.summary.module.${module.moduleId}.title`}
                        className="font-medium"
                      />
                      <TypographySmall
                        i18nKey="page.summary.today-count"
                        values={{ value: module.todayCount }}
                        testID={`page.summary.module.${module.moduleId}.count`}
                        variant="light"
                      />
                    </View>
                  </Pressable>
                </CardAtom>
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </ScreenLayout>
  );
}
