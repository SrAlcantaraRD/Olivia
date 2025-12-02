import { SQLiteCarerAdapter } from '@/database/adapter/sqlite.carer.adapter';
import { SQLiteModuleAdapter } from '@/database/adapter/sqlite.module.adapter';
import { SQLitePatientAdapter } from '@/database/adapter/sqlite.patient.adapter';
import type { ICarerPort } from '@/domain/carer/port/carer.port';
import type { IModulePort } from '@/domain/module/port/module.port';
import type { IPatientPort } from '@/domain/patient/port/patient.port';

interface IAdapters {
  carerAdapter: ICarerPort;
  moduleAdapter: IModulePort;
  patientAdapter: IPatientPort;
}

export const useAdapters = (): Readonly<IAdapters> => {
  const carerAdapter = new SQLiteCarerAdapter();
  const patientAdapter = new SQLitePatientAdapter();
  const moduleAdapter = new SQLiteModuleAdapter();

  return Object.freeze({
    carerAdapter,
    patientAdapter,
    moduleAdapter,
  });
};
