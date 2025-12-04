import { useRouter } from 'expo-router';

import { ExpoRouterNavigationAdapter } from '@/adapter/expo-router-navigation.adapter';
import { ToastUINotifyPortAdapter } from '@/adapter/toast.notify-port.adapter';
import { SQLiteCarerAdapter } from '@/database/adapter/sqlite.carer.adapter';
import { SQLiteModuleAdapter } from '@/database/adapter/sqlite.module.adapter';
import { SQLitePatientAdapter } from '@/database/adapter/sqlite.patient.adapter';
import type { ICarerPort } from '@/domain/carer/port/carer.port';
import type { INotifyPort } from '@/domain/core/port/notify.port';
import type { IModulePort } from '@/domain/module/port/module.port';
import type { IPatientPort } from '@/domain/patient/port/patient.port';
import type { INavigationPort } from '@/domain/ports/navigation.port';

interface IAdapters {
  carerAdapter: ICarerPort;
  moduleAdapter: IModulePort;
  patientAdapter: IPatientPort;
  notifyAdapter: INotifyPort;
  navigationAdapter: INavigationPort;
}

export const useAdapters = (): Readonly<IAdapters> => {
  const router = useRouter();

  const notifyAdapter = new ToastUINotifyPortAdapter();
  const navigationAdapter = new ExpoRouterNavigationAdapter(router);

  const carerAdapter = new SQLiteCarerAdapter();
  const patientAdapter = new SQLitePatientAdapter();
  const moduleAdapter = new SQLiteModuleAdapter();

  return Object.freeze({
    notifyAdapter,
    carerAdapter,
    patientAdapter,
    moduleAdapter,
    navigationAdapter,
  });
};
