import React from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import { useAdapters } from '@/adapter';
import { BASE_LOGGER } from '@/domain/core/adapter/logger.adapter';
import { useGetSummaryTrends } from '@/domain/summary/hook/get-summary-trends.hook';
import { useNavigation } from '@/hooks/use-navigation.hook';
import { CardAtom } from '@/ui/components/atoms/card.atom';
import {
  TypographyHeading,
  TypographyParagraph,
  TypographySmall,
} from '@/ui/components/atoms/typography.atom';
import { ScreenLayout } from '@/ui/components/layouts/screen.layout';

export default function SummaryTrendsScreen() {
  const { summaryTrendAdapter, notifyAdapter, navigationAdapter } =
    useAdapters();
  const { goToSummaryTrendDetail } = useNavigation({ navigationAdapter });

  const trendsHook = useGetSummaryTrends({
    loggerAdapter: BASE_LOGGER,
    summaryTrendAdapter,
    notifyAdapter,
  });

  React.useEffect(() => {
    void trendsHook.execute();
  }, []);

  return (
    <ScreenLayout
      testID="page.summary-trends"
      title="page.summary-trends.title"
      subtitle="page.summary-trends.subtitle"
    >
      <ScrollView
        className="flex-1"
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-4">
          <TypographyHeading
            testID="page.summary-trends.heading"
            i18nKey="page.summary-trends.heading"
            accessibilityRole="header"
          />

          {trendsHook.items.length === 0 ? (
            <CardAtom>
              <TypographySmall
                i18nKey="page.summary-trends.empty"
                testID="page.summary-trends.empty"
                variant="light"
              />
            </CardAtom>
          ) : (
            trendsHook.items.map((trend) => (
              <CardAtom key={`summary-trend-${trend.id}`}>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => goToSummaryTrendDetail(trend.id)}
                  style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
                >
                  <TypographyParagraph
                    i18nKey={trend.titleKey}
                    testID={`page.summary-trends.item.${trend.id}`}
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
