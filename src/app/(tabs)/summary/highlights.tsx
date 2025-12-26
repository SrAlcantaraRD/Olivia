import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';

import { useAdapters } from '@/adapter';
import { BASE_LOGGER } from '@/domain/core/adapter/logger.adapter';
import type { Ti18nKeys } from '@/domain/core/types/i18n.types';
import { useGetSummaryHighlights } from '@/domain/summary/hook/get-summary-highlights.hook';
import { RowEmptyAtom } from '@/ui/components/atoms/row-empty.atom';
import { ScreenLayout } from '@/ui/components/layouts/screen.layout';
import { RowAction } from '@/ui/components/molecules/row-action.molecule';
import { SummaryInsightCard } from '@/ui/components/molecules/summary-insight-card.molecule';
import { SummarySectionHeader } from '@/ui/components/molecules/summary-section-header.molecule';
import { useNavigation } from '@/ui/hook/use-navigation.hook';

const DEFAULT_HIGHLIGHT_SERIES = [1, 3, 2, 4, 2, 3, 4];

export default function SummaryHighlightsScreen() {
  const { t } = useTranslation();
  const { summaryHighlightAdapter, notifyAdapter, navigationAdapter } =
    useAdapters();
  const { goToSummaryAllData, goToSummaryModuleDetail } = useNavigation({
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
      title="page.summary_highlights.title"
      subtitle="page.summary_highlights.subtitle"
    >
      <ScrollView
        className="flex-1"
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-4">
          <RowAction
            iconName="heart"
            title="page.summary.all-data"
            onPress={goToSummaryAllData}
            testID="page.summary-highlights.all-data"
          />

          <SummarySectionHeader
            titleKey="page.summary_highlights.heading"
            testID="page.summary-highlights.heading"
          />

          {highlightsHook.items.length === 0 ? (
            <SummaryInsightCard
              titleKey="page.summary_highlights.empty"
              descriptionKey="page.summary_highlights.empty"
              iconName="alert"
              chartValues={DEFAULT_HIGHLIGHT_SERIES}
              chartAverage={3}
              testID="page.summary-highlights.empty"
            />
          ) : (
            highlightsHook.items.map((highlight) => (
              <SummaryInsightCard
                key={`summary-highlight-${highlight.id}`}
                titleKey={highlight.titleKey as Ti18nKeys}
                descriptionKey={highlight.descriptionKey as Ti18nKeys}
                iconName="flame"
                metricValue={3502}
                metricLabel={t('page.summary.metric-label.steps')}
                chartValues={DEFAULT_HIGHLIGHT_SERIES}
                chartAverage={3}
                onPress={() => {
                  if (highlight.moduleId) {
                    goToSummaryModuleDetail(String(highlight.moduleId));
                  }
                }}
                testID={`page.summary-highlights.item.${highlight.id}`}
              />
            ))
          )}

          <RowAction
            iconName="sparkles"
            title="page.summary.highlights"
            onPress={goToSummaryAllData}
            testID="page.summary-highlights.show-all"
          />
        </View>
        <RowEmptyAtom />
      </ScrollView>
    </ScreenLayout>
  );
}
