import { useRouter } from 'expo-router';

import { ExpoRouterNavigationAdapter } from '@/adapter/expo-router-navigation.adapter';
import { SecureStoreCacheAdapter } from '@/adapter/expo-secure-store.cache-port.adapter';
import { QrPortAdapter } from '@/adapter/minizlib.qr.adapter';
import { ToastUINotifyPortAdapter } from '@/adapter/toast.notify-port.adapter';
import { SQLiteCarerAdapter } from '@/database/adapter/sqlite.carer.adapter';
import { SQLiteModuleAdapter } from '@/database/adapter/sqlite.module.adapter';
import { SQLiteModuleFieldAdapter } from '@/database/adapter/sqlite.module-field.adapter';
import { SQLitePatientAdapter } from '@/database/adapter/sqlite.patient.adapter';
import { SQLiteRecordAdapter } from '@/database/adapter/sqlite.record.adapter';
import { SQLiteRecordFieldAdapter } from '@/database/adapter/sqlite.record-field.adapter';
import { SQLiteSummaryModuleAdapter } from '@/database/adapter/sqlite.summary-module.adapter';
import { SQLiteSummaryModuleFieldAdapter } from '@/database/adapter/sqlite.summary-module-field.adapter';
import type { ICarerPort } from '@/domain/carer/port/carer.port';
import {
  BASE_LOGGER,
  type TLoggerPort,
} from '@/domain/core/adapter/logger.adapter';
import type { ICachePort } from '@/domain/core/port/cache.port';
import type { INavigationPort } from '@/domain/core/port/navigation.port';
import type { INotifyPort } from '@/domain/core/port/notify.port';
import type { IQRPort } from '@/domain/core/port/qr.port';
import type { IModulePort } from '@/domain/module/port/module.port';
import type { IModuleFieldPort } from '@/domain/module/port/module-field.port';
import type { IRecordPort } from '@/domain/module/port/record.port';
import type { IRecordFieldPort } from '@/domain/module/port/record-field.port';
import type { IPatientPort } from '@/domain/patient/port/patient.port';
import type { ISummaryModulePort } from '@/domain/summary/port/summary-module.port';
import type { ISummaryModuleFieldPort } from '@/domain/summary/port/summary-module-field.port';

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
  qrAdapter: IQRPort;
  summaryModuleAdapter: ISummaryModulePort;
  summaryModuleFieldAdapter: ISummaryModuleFieldPort;
}

const notifyAdapter = new ToastUINotifyPortAdapter();

const carerAdapter = new SQLiteCarerAdapter();
const patientAdapter = new SQLitePatientAdapter();
const moduleAdapter = new SQLiteModuleAdapter();
const moduleFieldAdapter = new SQLiteModuleFieldAdapter();
const recordAdapter = new SQLiteRecordAdapter();
const recordFieldAdapter = new SQLiteRecordFieldAdapter();

const secureStoreAdapter = new SecureStoreCacheAdapter();
// const cacheAdapter = new SecureStoreCacheAdapter();

const qrAdapter = new QrPortAdapter(BASE_LOGGER);

const summaryModuleAdapter = new SQLiteSummaryModuleAdapter();
const summaryModuleFieldAdapter = new SQLiteSummaryModuleFieldAdapter();

export const useAdapters = (): Readonly<IAdapters> => {
  const router = useRouter();
  const navigationAdapter = new ExpoRouterNavigationAdapter(router);

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
    cacheAdapter: secureStoreAdapter,
    secureStoreAdapter,
    qrAdapter,
    summaryModuleAdapter,
    summaryModuleFieldAdapter,
  });
};
