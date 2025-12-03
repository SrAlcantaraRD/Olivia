import { SQLiteCarerAdapter } from '@/adapter/sqlite.carer.adapter';
import { SQLiteModuleAdapter } from '@/adapter/sqlite.module.adapter';
import { SQLitePatientAdapter } from '@/adapter/sqlite.patient.adapter';
import { ToastUINotifyPortAdapter } from '@/adapter/toast.notify-port.adapter';
import type { ICarerPort } from '@/domain/carer/port/carer.port';
import type { INotifyPort } from '@/domain/core/port/notify.port';
import type { IModulePort } from '@/domain/module/port/module.port';
import type { IPatientPort } from '@/domain/patient/port/patient.port';

interface IAdapters {
  carerAdapter: ICarerPort;
  moduleAdapter: IModulePort;
  patientAdapter: IPatientPort;
  notifyAdapter: INotifyPort;
}

export const useAdapters = (): Readonly<IAdapters> => {
  const notifyAdapter = new ToastUINotifyPortAdapter();

  const carerAdapter = new SQLiteCarerAdapter();
  const patientAdapter = new SQLitePatientAdapter();
  const moduleAdapter = new SQLiteModuleAdapter();

  return Object.freeze({
    notifyAdapter,
    carerAdapter,
    patientAdapter,
    moduleAdapter,
  });
};
