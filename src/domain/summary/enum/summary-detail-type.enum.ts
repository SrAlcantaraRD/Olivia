import { z } from 'zod';

export enum SUMMARY_DETAIL_TYPE_ENUM {
  MODULE = 'module',
  FIELD = 'field',
  TREND = 'trend',
}

export const SummaryDetailTypeSchema = z.enum(SUMMARY_DETAIL_TYPE_ENUM);
