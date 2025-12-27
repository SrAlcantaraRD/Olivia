import { z } from 'zod';

export enum SUMMARY_PIN_TYPE_ENUM {
  MODULE = 'module',
  FIELD = 'field',
  TREND = 'trend',
}

export const SummaryPinTypeSchema = z.enum(SUMMARY_PIN_TYPE_ENUM);
