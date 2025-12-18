import { useRouter } from 'expo-router';

import { ExpoRouterNavigationAdapter } from '@/adapter/expo-router-navigation.adapter';
import { SecureStoreCacheAdapter } from '@/adapter/expo-secure-store.cache-port.adapter';
import { ToastUINotifyPortAdapter } from '@/adapter/toast.notify-port.adapter';
import { SQLiteCarerAdapter } from '@/database/adapter/sqlite.carer.adapter';
import { SQLiteModuleFieldAdapter } from '@/database/adapter/sqlite.module-field.adapter';
import { SQLiteModuleAdapter } from '@/database/adapter/sqlite.module.adapter';
import { SQLitePatientAdapter } from '@/database/adapter/sqlite.patient.adapter';
import { SQLiteRecordFieldAdapter } from '@/database/adapter/sqlite.record-field.adapter';
import { SQLiteRecordAdapter } from '@/database/adapter/sqlite.record.adapter';
import { FakeDataSummaryDetailAdapter } from '@/database/adapter/fake-data.summary-detail.adapter';
import { FakeDataSummaryHighlightAdapter } from '@/database/adapter/fake-data.summary-highlight.adapter';
import { FakeDataSummaryModuleAdapter } from '@/database/adapter/fake-data.summary-module.adapter';
import { FakeDataSummaryPinsAdapter } from '@/database/adapter/fake-data.summary-pins.adapter';
import { FakeDataSummarySnapshotAdapter } from '@/database/adapter/fake-data.summary-snapshot.adapter';
import { FakeDataSummaryTrendAdapter } from '@/database/adapter/fake-data.summary-trend.adapter';
import type { ICarerPort } from '@/domain/carer/port/carer.port';
import {
  BASE_LOGGER,
  type TLoggerPort,
} from '@/domain/core/adapter/logger.adapter';
import type { ICachePort } from '@/domain/core/port/cache.port';
import type { INavigationPort } from '@/domain/core/port/navigation.port';
import type { INotifyPort } from '@/domain/core/port/notify.port';
import type { IModuleFieldPort } from '@/domain/module/port/module-field.port';
import type { IModulePort } from '@/domain/module/port/module.port';
import type { IRecordFieldPort } from '@/domain/module/port/record-field.port';
import type { IRecordPort } from '@/domain/module/port/record.port';
import type { IPatientPort } from '@/domain/patient/port/patient.port';
import type { ISummaryDetailPort } from '@/domain/summary/port/summary-detail.port';
import type { ISummaryHighlightPort } from '@/domain/summary/port/summary-highlight.port';
import type { ISummaryModulePort } from '@/domain/summary/port/summary-module.port';
import type { ISummaryPinsPort } from '@/domain/summary/port/summary-pins.port';
import type { ISummarySnapshotPort } from '@/domain/summary/port/summary-snapshot.port';
import type { ISummaryTrendPort } from '@/domain/summary/port/summary-trend.port';

interface IAdapters {
  cacheAdapter: ICachePort;
  carerAdapter: ICarerPort;
  loggerAdapter: TLoggerPort;
  moduleAdapter: IModulePort;
  moduleFieldAdapter: IModuleFieldPort;
  navigationAdapter: INavigationPort;
  notifyAdapter: INotifyPort;
  patientAdapter: IPatientPort;
  recordAdapter: IRecordPort;
  recordFieldAdapter: IRecordFieldPort;
  secureStoreAdapter: ICachePort;
  summaryDetailAdapter: ISummaryDetailPort;
  summaryHighlightAdapter: ISummaryHighlightPort;
  summaryModuleAdapter: ISummaryModulePort;
  summaryPinsAdapter: ISummaryPinsPort;
  summarySnapshotAdapter: ISummarySnapshotPort;
  summaryTrendAdapter: ISummaryTrendPort;
}

export const useAdapters = (): Readonly<IAdapters> => {
  const router = useRouter();

  const notifyAdapter = new ToastUINotifyPortAdapter();
  const navigationAdapter = new ExpoRouterNavigationAdapter(router);

  const carerAdapter = new SQLiteCarerAdapter();
  const patientAdapter = new SQLitePatientAdapter();
  const moduleAdapter = new SQLiteModuleAdapter();
  const moduleFieldAdapter = new SQLiteModuleFieldAdapter();
  const recordAdapter = new SQLiteRecordAdapter();
  const recordFieldAdapter = new SQLiteRecordFieldAdapter();

  const summaryModuleAdapter = new FakeDataSummaryModuleAdapter();
  const summaryDetailAdapter = new FakeDataSummaryDetailAdapter();
  const summaryTrendAdapter = new FakeDataSummaryTrendAdapter();
  const summaryHighlightAdapter = new FakeDataSummaryHighlightAdapter();
  const summaryPinsAdapter = new FakeDataSummaryPinsAdapter();
  const summarySnapshotAdapter = new FakeDataSummarySnapshotAdapter();

  const secureStoreAdapter = new SecureStoreCacheAdapter();
  // const cacheAdapter = new SecureStoreCacheAdapter();

  return Object.freeze({
    loggerAdapter: BASE_LOGGER,
    notifyAdapter,
    carerAdapter,
    patientAdapter,
    moduleAdapter,
    moduleFieldAdapter,
    recordAdapter,
    navigationAdapter,
    recordFieldAdapter,
    summaryDetailAdapter,
    summaryHighlightAdapter,
    summaryModuleAdapter,
    summaryPinsAdapter,
    summarySnapshotAdapter,
    summaryTrendAdapter,
    cacheAdapter: secureStoreAdapter,
    secureStoreAdapter,
  });
};
