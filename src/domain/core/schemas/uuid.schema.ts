import { z } from 'zod';

// UUID validation regex pattern
const UUID_REGEX =
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

// Custom UUID validation function
export const isValidUUID = (value: string): boolean => {
  return UUID_REGEX.test(value);
};

export const generateUUID = (): string => {
  // return crypto.randomUUID();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const UUIDSchema = z
  .string()
  .regex(UUID_REGEX, {
    message: 'Invalid UUID format',
  })
  .length(36);

export type TUUID = z.infer<typeof UUIDSchema>;

export const DEFAULT_UUID = '00000000-0000-0000-0000-000000000000';
