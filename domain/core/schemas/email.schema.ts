import { z } from 'zod';

// Email validation regex pattern
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Custom email validation function
export const isValidEmail = (value: string): boolean => {
  return EMAIL_REGEX.test(value);
};

export const EmailSchema = z.string().regex(EMAIL_REGEX, {
  message: 'Invalid email address',
});

export type TEmail = z.infer<typeof EmailSchema>;
export const DEFAULT_EMAIL = 'email-default@example.com';
