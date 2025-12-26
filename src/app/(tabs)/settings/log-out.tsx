import { differenceInDays, parseISO } from 'date-fns';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';

import { useAdapters } from '@/adapter';
import { BASE_LOGGER } from '@/domain/core/adapter/logger.adapter';
import { useWipeLocalData } from '@/domain/core/hook/use-wipe-local-data.hook';
import { useGetRecordStatistics } from '@/domain/module/hook/get-record-statistics.hook';
import { ButtonAtom } from '@/ui/components/atoms/button.atom';
import { CardAtom } from '@/ui/components/atoms/card.atom';
import {
  TypographyHeading,
  TypographyParagraph,
  TypographySmall,
  TypographyTitle,
} from '@/ui/components/atoms/typography.atom';
import type { Ti18nKeys } from '@/ui/i18n/locales/en-EN';

export default function LogoutConfirmScreen() {
  const router = useRouter();
  const { recordAdapter, notifyAdapter, cacheAdapter, secureStoreAdapter } =
    useAdapters();

  const { execute: executeGetStats, items: stats } = useGetRecordStatistics({
    loggerAdapter: BASE_LOGGER,
    recordAdapter,
    notifyAdapter,
  });

  const [earliestDay, setEarliestDay] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        await executeGetStats({ startDate: new Date(0), endDate: new Date() });
        const days = await recordAdapter.getCountsByDay();
        if (!mounted) return;
        if (Array.isArray(days) && days.length > 0) {
          setEarliestDay(days[0].day);
        }
      } catch (_err) {
        // ignore
      }
    })();

    return () => {
      mounted = false;
    };
  }, [executeGetStats, recordAdapter]);

  useEffect(() => {
    // compute total when stats change
    const sum = (stats?.countsByModule ?? []).reduce(
      (s, it) => s + (it.count ?? 0),
      0
    );
    setTotal(sum);
  }, [stats]);

  const daysRegistered = useMemo(() => {
    if (!earliestDay) return '0';
    try {
      const d = parseISO(earliestDay);
      const diff = differenceInDays(new Date(), d);
      return String(diff);
    } catch (_err) {
      return '0';
    }
  }, [earliestDay]);

  const onCancel = () => router.back();

  const { execute: executeWipe, isExecuting: isWiping } = useWipeLocalData({
    loggerAdapter: BASE_LOGGER,
    cacheAdapter,
    secureStoreAdapter,
  });

  // typed i18n keys used in this screen (cast to Ti18nKeys so the atom types align)
  const K_TIME_REGISTERED: Ti18nKeys =
    'page.settings.logout-confirm.time-registered-value';
  const K_TOTAL_RECORDS: Ti18nKeys =
    'page.settings.logout-confirm.total-records-value';
  const K_COMMON_NUMBER: Ti18nKeys = 'common.number';
  const onDelete = async () => {
    const resp = await executeWipe();
    if (resp.success) {
      notifyAdapter.success({
        title: 'common.success',
        description: 'page.settings.logout-confirm.delete-warning',
      });
      // Replace stack with index/root
      router.replace('/');
    } else {
      notifyAdapter.error({
        title: 'common.error',
        description: 'page.settings.logout-confirm.delete-warning',
      });
    }
  };

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16 }}
        contentInsetAdjustmentBehavior="automatic"
      >
        <View className="gap-4">
          <TypographyTitle
            testID="screen.settings.logout-confirm.title"
            i18nKey="page.settings.logout-confirm.title"
            accessibilityRole="header"
          />

          <CardAtom className="p-4 bg-danger/10 border border-danger-soft-hover">
            <TypographyParagraph
              testID="screen.settings.logout-confirm.warning"
              i18nKey="page.settings.logout-confirm.warning"
              className="font-medium text-danger"
            />
          </CardAtom>

          <View className="p-4 bg-default-100 rounded-lg">
            <TypographySmall
              testID="screen.settings.logout-confirm.summary-title"
              i18nKey="page.settings.logout-confirm.summary-title"
              className="font-semibold text-default-400 uppercase"
            />

            <View className="mt-3 gap-2">
              <View className="flex-row justify-between">
                <TypographySmall
                  testID="page.settings.logout-confirm.time-registered"
                  i18nKey="page.settings.logout-confirm.time-registered"
                  variant="light"
                />
                <TypographySmall
                  testID="page.settings.logout-confirm.time-registered-value"
                  i18nKey={K_TIME_REGISTERED}
                  values={{ count: Number(daysRegistered) }}
                  className="font-medium"
                />
              </View>

              <View className="flex-row justify-between">
                <TypographySmall
                  testID="page.settings.logout-confirm.total-records"
                  i18nKey="page.settings.logout-confirm.total-records"
                  variant="light"
                />
                <TypographySmall
                  testID="page.settings.logout-confirm.total-records-value"
                  i18nKey={K_TOTAL_RECORDS}
                  values={{ count: total }}
                  className="font-medium"
                />
              </View>

              <View className="flex-row justify-between">
                <TypographySmall
                  testID="screen.settings.logout-confirm.cic"
                  i18nKey="page.settings.logout-confirm.cic"
                  variant="light"
                />
                <TypographySmall
                  testID="screen.settings.logout-confirm.cic_value"
                  i18nKey={K_COMMON_NUMBER}
                  values={{
                    value:
                      stats?.countsByModule?.find((s) => s.moduleID === 1)
                        ?.count ?? 0,
                  }}
                  className="font-medium"
                />
              </View>

              <View className="flex-row justify-between">
                <TypographySmall
                  testID="screen.settings.logout-confirm.stools"
                  i18nKey="page.settings.logout-confirm.stools"
                  variant="light"
                />
                <TypographySmall
                  testID="screen.settings.logout-confirm.stools_value"
                  i18nKey={K_COMMON_NUMBER}
                  values={{
                    value:
                      stats?.countsByModule?.find((s) => s.moduleID === 2)
                        ?.count ?? 0,
                  }}
                  className="font-medium"
                />
              </View>

              <View className="flex-row justify-between">
                <TypographySmall
                  testID="screen.settings.logout-confirm.enemas"
                  i18nKey="page.settings.logout-confirm.enemas"
                  variant="light"
                />
                <TypographySmall
                  testID="screen.settings.logout-confirm.enemas_value"
                  i18nKey={K_COMMON_NUMBER}
                  values={{
                    value:
                      stats?.countsByModule?.find((s) => s.moduleID === 3)
                        ?.count ?? 0,
                  }}
                  className="font-medium"
                />
              </View>

              <View className="flex-row justify-between">
                <TypographySmall
                  testID="screen.settings.logout-confirm.medication"
                  i18nKey="page.settings.logout-confirm.medication"
                  variant="light"
                />
                <TypographySmall
                  testID="screen.settings.logout-confirm.medication_value"
                  i18nKey={K_COMMON_NUMBER}
                  values={{
                    value:
                      stats?.countsByModule?.find((s) => s.moduleID === 4)
                        ?.count ?? 0,
                  }}
                  className="font-medium"
                />
              </View>
            </View>
          </View>

          <TypographyHeading
            testID="screen.settings.logout-confirm.confirm-question"
            i18nKey="page.settings.logout-confirm.confirm-question"
            accessibilityRole="header"
          />

          <View className="flex-row gap-3">
            <View style={{ flex: 2 }}>
              <ButtonAtom
                title="common.cancel"
                testID="logout.cancel"
                accessibilityLabel="a11y.button.cancel"
                onPress={onCancel}
                isDisabled={isWiping}
              />
            </View>
            <View style={{ flex: 1 }}>
              <ButtonAtom
                title="common.delete"
                testID="logout.delete"
                accessibilityLabel="a11y.button.delete"
                onPress={onDelete}
                isDisabled={isWiping}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
