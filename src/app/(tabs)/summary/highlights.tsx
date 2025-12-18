import React from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import { useAdapters } from '@/adapter';
import { BASE_LOGGER } from '@/domain/core/adapter/logger.adapter';
import { useGetSummaryHighlights } from '@/domain/summary/hook/get-summary-highlights.hook';
import { useNavigation } from '@/hooks/use-navigation.hook';
import { CardAtom } from '@/ui/components/atoms/card.atom';
import {
  TypographyHeading,
  TypographyParagraph,
  TypographySmall,
} from '@/ui/components/atoms/typography.atom';
import { ScreenLayout } from '@/ui/components/layouts/screen.layout';

export default function SummaryHighlightsScreen() {
  const { summaryHighlightAdapter, notifyAdapter, navigationAdapter } =
    useAdapters();
  const { goToSummaryHome, goToSummaryModuleDetail } = useNavigation({
    navigationAdapter,
  });

  const highlightsHook = useGetSummaryHighlights({
    loggerAdapter: BASE_LOGGER,
    summaryHighlightAdapter,
    notifyAdapter,
  });

  React.useEffect(() => {
    void highlightsHook.execute();
  }, []);

  return (
    <ScreenLayout
      testID="page.summary-highlights"
      title="page.summary-highlights.title"
      subtitle="page.summary-highlights.subtitle"
    >
      <ScrollView
        className="flex-1"
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-4">
          <TypographyHeading
            testID="page.summary-highlights.heading"
            i18nKey="page.summary-highlights.heading"
            accessibilityRole="header"
          />

          {highlightsHook.items.length === 0 ? (
            <CardAtom>
              <TypographySmall
                i18nKey="page.summary-highlights.empty"
                testID="page.summary-highlights.empty"
                variant="light"
              />
            </CardAtom>
          ) : (
            highlightsHook.items.map((highlight) => (
              <CardAtom key={`summary-highlight-${highlight.id}`}>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => {
                    if (highlight.moduleId) {
                      goToSummaryModuleDetail(String(highlight.moduleId));
                      return;
                    }

                    goToSummaryHome();
                  }}
                  style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
                >
                  <TypographyParagraph
                    i18nKey={highlight.titleKey}
                    testID={`page.summary-highlights.item.${highlight.id}`}
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
