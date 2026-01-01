import { useCallback, useEffect } from 'react';
import { View } from 'react-native';

import { useAdapters } from '@/adapter';
import type { TID } from '@/domain/core/schemas/id.schema';
import { SUMMARY_PERIOD_ENUM } from '@/domain/summary/enum/summary-period.enum';
import { useGetSummaryModuleDetailByPeriod } from '@/domain/summary/hook/use-get-summary-module-detail-by-period.hook';
import { CardAtom } from '@/ui/components/atoms/card.atom';
import { TypographySmall } from '@/ui/components/atoms/typography.atom';
import { SummaryModuleFieldCard } from '@/ui/components/molecules/summary-card.module-field.molecule';
import { SummarySectionHeader } from '@/ui/components/molecules/summary-section-header.molecule';

interface SummaryModuleFieldsSectionProps {
  moduleID: number;
  testID: string;
}

export const SummaryModuleFieldsSection = ({
  moduleID,
  testID,
}: SummaryModuleFieldsSectionProps) => {
  const {
    notifyAdapter,
    loggerAdapter,
    cacheAdapter,
    summaryModuleAdapter,
    summaryModuleFieldAdapter,
  } = useAdapters();

  const {
    items: summaryModule,
    execute,
    isExecuting,
  } = useGetSummaryModuleDetailByPeriod({
    loggerAdapter,
    notifyAdapter,
    cacheAdapter,
    summaryModuleAdapter,
    summaryModuleFieldAdapter,
  });

  const loadFields = useCallback(async (moduleID: TID) => {
    await execute({
      period: SUMMARY_PERIOD_ENUM.WEEK,
      moduleID,
    });
  }, []);

  useEffect(() => {
    loadFields(moduleID);
  }, [moduleID]);

  const summaryModuleFieldList = summaryModule.summaryModuleFieldList;

  return (
    <View className="gap-2" testID={testID}>
      <SummarySectionHeader
        titleKey="page.summary-detail.fields"
        testID={`${testID}.header`}
      />

      {isExecuting ? (
        <CardAtom testID={`${testID}.loading-card`}>
          <TypographySmall
            testID={`${testID}.loading`}
            i18nKey="common.loading"
            variant="light"
          />
        </CardAtom>
      ) : summaryModuleFieldList.length === 0 ? (
        <CardAtom testID={`${testID}.empty-card`}>
          <TypographySmall
            testID={`${testID}.empty`}
            i18nKey="page.summary-detail.fields-empty"
            variant="light"
          />
        </CardAtom>
      ) : (
        summaryModuleFieldList.map((field) => (
          <SummaryModuleFieldCard
            key={`summary-field-${field.metadata.moduleField.id}`}
            testID={`${testID}.${field.metadata.moduleField.id}`}
            summaryModuleField={field}
          />
        ))
      )}
    </View>
  );
};
