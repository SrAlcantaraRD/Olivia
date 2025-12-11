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
        await executeGetStats({ start: 0, end: Math.floor(Date.now() / 1000) });
        const days = await recordAdapter.getCountsByDay();
        if (!mounted) return;
        if (Array.isArray(days) && days.length > 0) {
          setEarliestDay(days[0].day);
        }
      } catch (err) {
        // ignore
      }
    })();

    return () => {
      mounted = false;
    };
  }, [executeGetStats, recordAdapter]);

  useEffect(() => {
    // compute total when stats change
    const sum = (stats ?? []).reduce((s, it) => s + (it.count ?? 0), 0);
    setTotal(sum);
  }, [stats]);

  const daysRegistered = useMemo(() => {
    if (!earliestDay) return '0';
    try {
      const d = new Date(earliestDay + 'T00:00:00Z');
      const diff = Math.floor(
        (Date.now() - d.getTime()) / (1000 * 60 * 60 * 24)
      );
      return String(diff);
    } catch (err) {
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
  const K_TIME_REGISTERED =
    'page.settings.logout_confirm.time_registered_value' as Ti18nKeys;
  const K_TOTAL_RECORDS =
    'page.settings.logout_confirm.total_records_value' as Ti18nKeys;
  const K_COMMON_NUMBER = 'common.number' as Ti18nKeys;

  const onDelete = async () => {
    const resp = await executeWipe();
    if (resp.success) {
      notifyAdapter.success({
        title: 'common.success',
        description: 'page.settings.logout_confirm.delete_warning',
      });
      // Replace stack with index/root
      router.replace('/');
    } else {
      notifyAdapter.error({
        title: 'common.error',
        description: 'page.settings.logout_confirm.delete_warning',
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
        <View className="gap-6">
          <TypographyTitle
            i18nKey="page.settings.logout_confirm.title"
            accessibilityRole="header"
          />

          <CardAtom className="p-4 bg-danger/10 border border-danger-soft-hover">
            <TypographyParagraph
              i18nKey="page.settings.logout_confirm.warning"
              className="font-medium text-danger"
            />
          </CardAtom>

          <View className="p-4 bg-default-100 rounded-lg">
            <TypographySmall
              i18nKey="page.settings.logout_confirm.summary_title"
              className="font-semibold text-default-400 uppercase"
            />

            <View className="mt-3 gap-2">
              <View className="flex-row justify-between">
                <TypographySmall
                  i18nKey="page.settings.logout_confirm.time_registered"
                  variant="light"
                />
                <TypographySmall
                  i18nKey={K_TIME_REGISTERED}
                  values={{ count: Number(daysRegistered) }}
                  className="font-medium"
                />
              </View>

              <View className="flex-row justify-between">
                <TypographySmall
                  i18nKey="page.settings.logout_confirm.total_records"
                  variant="light"
                />
                <TypographySmall
                  i18nKey={K_TOTAL_RECORDS}
                  values={{ count: total }}
                  className="font-medium"
                />
              </View>

              <View className="flex-row justify-between">
                <TypographySmall
                  i18nKey="page.settings.logout_confirm.cic"
                  variant="light"
                />
                <TypographySmall
                  i18nKey={K_COMMON_NUMBER}
                  values={{
                    value: stats?.find((s) => s.moduleID === 1)?.count ?? 0,
                  }}
                  className="font-medium"
                />
              </View>

              <View className="flex-row justify-between">
                <TypographySmall
                  i18nKey="page.settings.logout_confirm.stools"
                  variant="light"
                />
                <TypographySmall
                  i18nKey={K_COMMON_NUMBER}
                  values={{
                    value: stats?.find((s) => s.moduleID === 2)?.count ?? 0,
                  }}
                  className="font-medium"
                />
              </View>

              <View className="flex-row justify-between">
                <TypographySmall
                  i18nKey="page.settings.logout_confirm.enemas"
                  variant="light"
                />
                <TypographySmall
                  i18nKey={K_COMMON_NUMBER}
                  values={{
                    value: stats?.find((s) => s.moduleID === 3)?.count ?? 0,
                  }}
                  className="font-medium"
                />
              </View>

              <View className="flex-row justify-between">
                <TypographySmall
                  i18nKey="page.settings.logout_confirm.medication"
                  variant="light"
                />
                <TypographySmall
                  i18nKey={K_COMMON_NUMBER}
                  values={{
                    value: stats?.find((s) => s.moduleID === 4)?.count ?? 0,
                  }}
                  className="font-medium"
                />
              </View>
            </View>
          </View>

          <TypographyHeading
            i18nKey="page.settings.logout_confirm.confirm_question"
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
