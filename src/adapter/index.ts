import { useRouter } from 'expo-router';

import { ExpoRouterNavigationAdapter } from '@/adapter/expo-router-navigation.adapter';
import { SecureStoreCacheAdapter } from '@/adapter/expo-secure-store.cache-port.adapter';
import { ToastUINotifyPortAdapter } from '@/adapter/toast.notify-port.adapter';
import { SQLiteCarerAdapter } from '@/database/adapter/sqlite.carer.adapter';
import { SQLiteModuleFieldAdapter } from '@/database/adapter/sqlite.module-field.adapter';
import { SQLiteModuleAdapter } from '@/database/adapter/sqlite.module.adapter';
import { SQLitePatientAdapter } from '@/database/adapter/sqlite.patient.adapter';
import { SQLiteRecordAdapter } from '@/database/adapter/sqlite.record.adapter';
import type { ICarerPort } from '@/domain/carer/port/carer.port';
import {
  BASE_LOGGER,
  type TLoggerPort,
} from '@/domain/core/adapter/logger.adapter';
import type { ICachePort } from '@/domain/core/port/cache.port';
import type { INotifyPort } from '@/domain/core/port/notify.port';
import type { IModuleFieldPort } from '@/domain/module/port/module-field.port';
import type { IModulePort } from '@/domain/module/port/module.port';
import type { IRecordPort } from '@/domain/module/port/record.port';
import type { IPatientPort } from '@/domain/patient/port/patient.port';
import type { INavigationPort } from '@/domain/ports/navigation.port';

interface IAdapters {
  carerAdapter: ICarerPort;
  moduleAdapter: IModulePort;
  moduleFieldAdapter: IModuleFieldPort;
  recordAdapter: IRecordPort;
  patientAdapter: IPatientPort;
  notifyAdapter: INotifyPort;
  navigationAdapter: INavigationPort;
  cacheAdapter: ICachePort;
  secureStoreAdapter: ICachePort;
  loggerAdapter: TLoggerPort;
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
    cacheAdapter: secureStoreAdapter,
    secureStoreAdapter,
  });
};
