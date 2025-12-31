import { useCallback, useEffect, useMemo } from 'react';
import { View } from 'react-native';

import { useAdapters } from '@/adapter';
import { SUMMARY_PERIOD_ENUM } from '@/domain/summary/enum/summary-period.enum';
import { useGetSummaryModuleDetailByPeriod } from '@/domain/summary/hook/use-get-summary-module-detail-by-period.hook';
import { CardAtom } from '@/ui/components/atoms/card.atom';
import { TypographySmall } from '@/ui/components/atoms/typography.atom';
import {
  SummaryCard,
  SummaryCardChartType,
} from '@/ui/components/molecules/summary-card.molecule';
import { SummarySectionHeader } from '@/ui/components/molecules/summary-section-header.molecule';
import { useNavigation } from '@/ui/hook/use-navigation.hook';

interface SummaryModuleFieldsSectionProps {
  moduleID: number;
  testID?: string;
}

export const SummaryModuleFieldsSection = ({
  moduleID,
  testID = 'page.summary-detail.fields',
}: SummaryModuleFieldsSectionProps) => {
  const {
    moduleAdapter,
    moduleFieldAdapter,
    recordAdapter,
    recordFieldAdapter,
    notifyAdapter,
    loggerAdapter,
    cacheAdapter,
    summaryAdapter,
    navigationAdapter,
  } = useAdapters();

  const { goToSummaryFieldDetail } = useNavigation({ navigationAdapter });

  const {
    items: summaryModule,
    execute,
    isExecuting,
  } = useGetSummaryModuleDetailByPeriod({
    loggerAdapter,
    notifyAdapter,
    cacheAdapter,
    moduleAdapter,
    moduleFieldAdapter,
    recordAdapter,
    recordFieldAdapter,
    summaryAdapter,
  });

  const loadFields = useCallback(async () => {
    await execute({
      period: SUMMARY_PERIOD_ENUM.WEEK,
      moduleID,
    });
  }, [moduleID]);

  useEffect(() => {
    loadFields();
  }, []);

  const totalCount = summaryModule.groupedData?.metadata.totalCount ?? 0;
  const bucketCount = summaryModule.groupedData?.buckets?.length ?? 0;
  const averageValue =
    bucketCount > 0 && summaryModule.statistics?.lastRecordedAt
      ? totalCount / bucketCount
      : 0;

  const fieldList = useMemo(
    () => summaryModule.moduleFieldList ?? [],
    [summaryModule]
  );

  return (
    <View className="gap-2" testID={testID}>
      <SummarySectionHeader
        titleKey="page.summary-detail.fields"
        testID={`${testID}.header`}
      />

      {isExecuting ? (
        <CardAtom>
          <TypographySmall
            testID={`${testID}.loading`}
            i18nKey="common.loading"
            variant="light"
          />
        </CardAtom>
      ) : fieldList.length === 0 ? (
        <CardAtom>
          <TypographySmall
            testID={`${testID}.empty`}
            i18nKey="page.summary-detail.fields-empty"
            variant="light"
          />
        </CardAtom>
      ) : (
        fieldList.map((field) => (
          <SummaryCard
            chartType={SummaryCardChartType.BAR}
            key={`summary-field-${field.id}`}
            title={field.code}
            metricValue={totalCount}
            metricLabel="page.summary.metric-label.total"
            iconName="flame"
            chartAverage={averageValue}
            fieldType={field.type}
            onPress={() =>
              goToSummaryFieldDetail(String(moduleID), String(field.id))
            }
            testID={`${testID}.${field.id}`}
          />
        ))
      )}
    </View>
  );
};
