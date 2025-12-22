import { useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import type z from 'zod';

import { useAdapters } from '@/adapter';
import type {
  CarerSyncHistoryEntrySchema,
  CarerTTLMetadataSchema,
} from '@/domain/carer/dto/carer-management.dto';
import type { TCarer } from '@/domain/carer/entity/carer.entity';
import { CACHE_KEY_ENUM } from '@/domain/core/port/cache.port';
import { ButtonAtom } from '@/ui/components/atoms/button.atom';
import { CardAtom } from '@/ui/components/atoms/card.atom';
import { SpinnerAtom } from '@/ui/components/atoms/spinner.atom';
import {
  TypographyParagraph,
  TypographyTitle,
} from '@/ui/components/atoms/typography.atom';
import { ScreenLayout } from '@/ui/components/layouts/screen.layout';

export default function CarerDetailScreen() {
  const params = useLocalSearchParams<{ carerID?: string }>();
  const carerID = Number(params.carerID ?? 0);
  const { carerAdapter, cacheAdapter, loggerAdapter } = useAdapters();

  const [carer, setCarer] = useState<TCarer | null>(null);
  const [ttl, setTTL] = useState<z.infer<typeof CarerTTLMetadataSchema> | null>(
    null
  );
  const [history, setHistory] = useState<
    z.infer<typeof CarerSyncHistoryEntrySchema>[]
  >([]);

  useEffect(() => {
    if (!carerID) return;

    (async () => {
      try {
        const fetched = await carerAdapter.getByID(carerID);
        setCarer(fetched);

        const ttlMap = await cacheAdapter.get<
          Record<string, z.infer<typeof CarerTTLMetadataSchema>>
        >(CACHE_KEY_ENUM.CARER_TTL_METADATA);

        setTTL(ttlMap?.[carerID] ?? null);

        const historyMap = await cacheAdapter.get<
          Record<string, z.infer<typeof CarerSyncHistoryEntrySchema>[]>
        >(CACHE_KEY_ENUM.CARER_SYNC_HISTORY);

        setHistory(historyMap?.[carerID] ?? []);
      } catch (error) {
        loggerAdapter.error('carer-detail', error);
      }
    })();
  }, [carerID, carerAdapter, cacheAdapter, loggerAdapter]);

  const historyRows = useMemo(() => {
    if (!history.length) {
      return (
        <TypographyParagraph
          testID="carer-detail.history.empty"
          i18nKey="page.carer-detail.sync-history.empty"
        />
      );
    }

    return history.map((entry) => (
      <CardAtom key={entry.id} className="p-3">
        <TypographyParagraph
          testID={`carer-history-${entry.id}`}
          i18nKey="page.carer-detail.history.record"
          values={{
            timestamp: entry.timestamp,
            status:
              entry.status === 'success'
                ? 'page.carer-detail.history.status.success'
                : 'page.carer-detail.history.status.failure',
            records: entry.recordsImported,
            details: entry.details ?? '',
          }}
        />
      </CardAtom>
    ));
  }, [history]);

  return (
    <ScreenLayout
      title="page.carer-detail.title"
      subtitle="page.carer-detail.subtitle"
      testID="screen.settings.carer-detail"
    >
      <ScrollView
        className="flex-1 px-4 space-y-4"
        contentContainerStyle={{ paddingVertical: 12 }}
      >
        {!carer ? (
          <View className="items-center py-16">
            <SpinnerAtom testID="screen.carer-detail.spinner" />
          </View>
        ) : (
          <>
            <CardAtom className="p-4 space-y-3">
              <TypographyTitle
                testID="carer-detail.heading"
                i18nKey="page.carer-detail.heading"
              />
              <TypographyParagraph
                testID="carer-detail.name"
                i18nKey="page.carer-detail.name-value"
                values={{ name: carer.name }}
              />
              <TypographyParagraph
                testID="carer-detail.ttl"
                i18nKey="page.carer-detail.ttl"
                values={{
                  ttl: ttl ? ttl.ttlLabel : 'N/A',
                  expiresAt: ttl ? ttl.expiresAt : '—',
                }}
              />
              <ButtonAtom
                title="page.carer-detail.analysis-button"
                testID="carer-detail.analysis"
                onPress={() => {}}
                isDisabled
              />
            </CardAtom>
            <View>
              <TypographyTitle
                testID="carer-detail.history.heading"
                i18nKey="page.carer-detail.sync-history.title"
              />
              <View className="space-y-2">{historyRows}</View>
            </View>
          </>
        )}
      </ScrollView>
    </ScreenLayout>
  );
}
