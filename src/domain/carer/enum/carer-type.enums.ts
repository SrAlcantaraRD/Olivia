import z from 'zod';

export enum CARER_TYPE {
  ADMIN = 'ADMIN',
  SECONDARY = 'SECUNDARIO',
  HEALTH = 'SANITARIO',
}

export const CarerTypeSchema = z.enum(CARER_TYPE);
