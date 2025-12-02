import { z } from 'zod';

export enum SEX {
  MALE = 'M',
  FEMALE = 'F',
}

export const SexSchema = z.enum(SEX);
