import { z } from 'zod';

export enum MODULE_FIELD_TYPE {
  TEXT = 'TEXT',
  NUMBER = 'NUMBER',
  SELECT = 'SELECT',
  MULTISELECT = 'MULTISELECT',
  BOOLEAN = 'BOOLEAN',
  DATE = 'DATE',
  TIME = 'TIME',
  TEXTAREA = 'TEXTAREA',
}

export const ModuleFieldTypeSchema = z.enum(MODULE_FIELD_TYPE);
