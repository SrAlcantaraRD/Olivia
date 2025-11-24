import { z } from 'zod';

// Password validation regex pattern
// Requires: at least one digit, one lowercase, one uppercase, one special char, min 8 chars
const PASSWORD_REGEX =
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])[a-zA-Z0-9!@#$%^&*(),.?":{}|<>]{8,}$/;

// Custom password validation function
export const isValidPassword = (value: string): boolean => {
  return PASSWORD_REGEX.test(value);
};

/**
 * Password validation schema with the following requirements:
 * - Minimum length: 8 characters
 * - Maximum length: 100 characters
 * - At least one digit (0-9)
 * - At least one lowercase letter (a-z)
 * - At least one uppercase letter (A-Z)
 * - At least one special character (!@#$%^&*(),.?":{}|<>)
 */
export const PasswordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(100, 'Password must not exceed 100 characters')
  .regex(PASSWORD_REGEX, {
    message:
      'Password must contain at least one digit, one lowercase letter, one uppercase letter, and one special character',
  });

export type TPassword = z.infer<typeof PasswordSchema>;
