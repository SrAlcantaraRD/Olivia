import React from 'react';
import { ScrollView, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import { useAdapters } from '@/adapter';
import { BASE_LOGGER } from '@/domain/core/adapter/logger.adapter';
import { SUMMARY_DETAIL_TYPE_ENUM } from '@/domain/summary/enum/summary-detail-type.enum';
import { SUMMARY_PERIOD_ENUM } from '@/domain/summary/enum/summary-period.enum';
import { useGetSummaryDetail } from '@/domain/summary/hook/get-summary-detail.hook';
import { CardAtom } from '@/ui/components/atoms/card.atom';
import {
  TypographyHeading,
  TypographyParagraph,
  TypographySmall,
} from '@/ui/components/atoms/typography.atom';
import { ScreenLayout } from '@/ui/components/layouts/screen.layout';

export default function SummaryTrendDetailScreen() {
  const params = useLocalSearchParams<{ trendId?: string }>();
  const trendId = params.trendId ?? '';

  const { summaryDetailAdapter, notifyAdapter } = useAdapters();

  const detailHook = useGetSummaryDetail({
    loggerAdapter: BASE_LOGGER,
    summaryDetailAdapter,
    notifyAdapter,
  });

  React.useEffect(() => {
    if (!trendId) return;
    void detailHook.execute({
      type: SUMMARY_DETAIL_TYPE_ENUM.TREND,
      trendId,
      period: SUMMARY_PERIOD_ENUM.WEEK,
    });
  }, [trendId]);

  return (
    <ScreenLayout
      testID="page.summary-detail-trend"
      title="page.summary-detail.title"
      subtitle="page.summary-detail.subtitle"
    >
      <ScrollView
        className="flex-1"
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-4">
          <CardAtom>
            <TypographyHeading
              testID="page.summary-detail.heading"
              i18nKey="page.summary-detail.heading"
              accessibilityRole="header"
            />
            <TypographySmall
              i18nKey="common.raw-value"
              values={{ value: trendId }}
              testID="page.summary-detail.trend-id"
              variant="light"
            />
          </CardAtom>

          <CardAtom>
            <TypographyParagraph
              i18nKey="common.raw-value"
              values={{ value: detailHook.items.titleKey }}
              testID="page.summary-detail.titleKey"
              className="font-medium"
            />
            <TypographySmall
              i18nKey="common.raw-value"
              values={{ value: detailHook.items.descriptionKey }}
              testID="page.summary-detail.descriptionKey"
              variant="light"
            />
          </CardAtom>
        </View>
      </ScrollView>
    </ScreenLayout>
  );
}
