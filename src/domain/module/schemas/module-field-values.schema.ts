import { z } from 'zod';

export const ModuleFieldSelectValuesSchema = z
  .array(z.string().min(1, 'validation.module-field.values.item.min.error'))
  .min(1, 'validation.module-field.values.min.error');

export const ModuleFieldSelectValuesFromJsonStringSchema = z.preprocess(
  (value) => {
    if (typeof value !== 'string') return value;
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  },
  ModuleFieldSelectValuesSchema
);

export const ModuleFieldSelectValuesJsonStringSchema = z
  .string()
  .min(1, 'validation.module-field.values.json.min.error')
  .refine((value) => {
    return ModuleFieldSelectValuesFromJsonStringSchema.safeParse(value).success;
  }, 'validation.module-field.values.json-array.error');
