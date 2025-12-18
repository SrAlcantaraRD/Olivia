import React from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import { useAdapters } from '@/adapter';
import { BASE_LOGGER } from '@/domain/core/adapter/logger.adapter';
import { useGetListActiveModule } from '@/domain/module/hook/get-list-active-module.hook';
import type { TRequestGetActiveModuleList } from '@/domain/module/use-case-schema/get-active-module-list.use-case-schema';
import { useNavigation } from '@/hooks/use-navigation.hook';
import { CardAtom } from '@/ui/components/atoms/card.atom';
import {
  TypographyHeading,
  TypographyParagraph,
  TypographySmall,
} from '@/ui/components/atoms/typography.atom';
import { ScreenLayout } from '@/ui/components/layouts/screen.layout';

export default function SummaryAllDataScreen() {
  const { moduleAdapter, notifyAdapter, navigationAdapter } = useAdapters();
  const { goToSummaryModuleDetail } = useNavigation({ navigationAdapter });

  const activeModuleHook = useGetListActiveModule({
    loggerAdapter: BASE_LOGGER,
    moduleAdapter,
    notifyAdapter,
  });

  React.useEffect(() => {
    void activeModuleHook.execute(undefined as TRequestGetActiveModuleList);
  }, []);

  return (
    <ScreenLayout
      testID="page.summary-all-data"
      title="page.summary-all-data.title"
      subtitle="page.summary-all-data.subtitle"
    >
      <ScrollView
        className="flex-1"
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-4">
          <TypographyHeading
            testID="page.summary-all-data.heading"
            i18nKey="page.summary-all-data.heading"
            accessibilityRole="header"
          />

          {activeModuleHook.items.length === 0 ? (
            <CardAtom>
              <TypographySmall
                i18nKey="page.summary-all-data.empty"
                testID="page.summary-all-data.empty"
                variant="light"
              />
            </CardAtom>
          ) : (
            activeModuleHook.items.map((module) => (
              <CardAtom key={`summary-all-data-${module.id}`}>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => goToSummaryModuleDetail(String(module.id))}
                  style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
                >
                  <TypographyParagraph
                    i18nKey="common.raw-value"
                    values={{ value: module.name }}
                    testID={`page.summary-all-data.item.${module.id}`}
                    className="font-medium"
                  />
                </Pressable>
              </CardAtom>
            ))
          )}
        </View>
      </ScrollView>
    </ScreenLayout>
  );
}
