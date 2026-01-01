import { formatDate } from 'date-fns';
import { ScrollView, View } from 'react-native';

import {
  TypographyParagraph,
  TypographyTitle,
} from '@/ui/components/atoms/typography.atom';
import type { TSynchronizationSummary } from '../use-synchronization-wizard.hook';

interface ConfirmationStepProps {
  totalChunks: number | null;
  summary: TSynchronizationSummary;
}

export function ConfirmationStep({
  totalChunks,
  summary,
}: ConfirmationStepProps) {
  return (
    <ScrollView className="flex-1 p-4">
      <View className="gap-4">
        <View className="items-center py-4">
          <View className="w-16 h-16 rounded-full bg-accent/20 items-center justify-center">
            <TypographyTitle
              i18nKey="common.raw-value"
              values={{ value: '✓' }}
              className="text-accent"
              testID="sync.confirmation.check"
            />
          </View>
        </View>

        <View className="gap-4">
          <TypographyTitle
            i18nKey="page.settings.synchronization.summary.title"
            size="lg"
            className="text-center"
            testID="sync.confirmation.title"
          />
          <TypographyParagraph
            i18nKey="page.settings.synchronization.summary.desc"
            className="text-center text-muted"
            testID="sync.confirmation.desc"
          />
        </View>

        <View className="bg-muted/10 p-4 rounded-xl gap-2">
          <TypographyParagraph
            i18nKey="page.settings.synchronization.summary.stats.title"
            className="font-semibold"
            testID="sync.confirmation.stats.title"
          />
          <TypographyParagraph
            i18nKey="page.settings.synchronization.summary.stats.chunks"
            values={{ count: totalChunks || 0 }}
            testID="sync.confirmation.stats.chunks"
          />
          <TypographyParagraph
            i18nKey="page.settings.synchronization.summary.stats.records"
            values={{ count: summary?.count || 0 }}
            testID="sync.confirmation.stats.records"
          />
          <TypographyParagraph
            i18nKey="page.settings.synchronization.summary.stats.dates"
            values={{
              startDate: formatDate(summary.startDate, 'yyyy/MM/dd hh:mm'),
              endDate: formatDate(summary.endDate, 'yyyy/MM/dd hh:mm'),
            }}
            testID="sync.confirmation.stats.dates"
          />
        </View>
      </View>
    </ScrollView>
  );
}
