import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';

import { useAdapters } from '@/adapter';
import { BASE_LOGGER } from '@/domain/core/adapter/logger.adapter';
import type { Ti18nKeys } from '@/domain/core/types/i18n.types';
import { useGetSummaryHighlights } from '@/domain/summary/hook/get-summary-highlights.hook';
import { ScreenLayout } from '@/ui/components/layouts/screen.layout';
import { SummaryInsightCard } from '@/ui/components/molecules/summary-insight-card.molecule';
import { SummaryRow } from '@/ui/components/molecules/summary-row.molecule';
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
      title="page.summary-highlights.title"
      subtitle="page.summary-highlights.subtitle"
    >
      <ScrollView
        className="flex-1"
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-6">
          <SummaryRow
            iconName="heart"
            titleKey="page.summary.all-data"
            onPress={goToSummaryAllData}
            testID="page.summary-highlights.all-data"
          />

          <SummarySectionHeader
            titleKey="page.summary-highlights.heading"
            testID="page.summary-highlights.heading"
          />

          {highlightsHook.items.length === 0 ? (
            <SummaryInsightCard
              titleKey="page.summary-highlights.empty"
              descriptionKey="page.summary-highlights.empty"
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

          <SummaryRow
            iconName="sparkles"
            titleKey="page.summary.highlights"
            onPress={goToSummaryAllData}
            testID="page.summary-highlights.show-all"
          />
        </View>
      </ScrollView>
    </ScreenLayout>
  );
}
