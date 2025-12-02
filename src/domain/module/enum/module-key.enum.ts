import { z } from 'zod';

export enum MODULE_KEY {
  CIC = 'CIC',
  URINE = 'URINE',
  STOOL = 'STOOL',
  MEDICATION = 'MEDICATION',
  ENEMA = 'ENEMA',
}

export const ModuleKeySchema = z.enum(MODULE_KEY);
