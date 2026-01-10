/// <reference types="jest" />

import { describe, expect, it } from '@jest/globals';

import { ErrorCannotParseSchema } from '@/domain/core/error/cannot-parse-schema.error';
import { getSexTypeFromValue, SEX_ENUM } from '@/domain/patient/enum/sex.enum';

describe('[Enum] - Sex', () => {
  describe('SEX_ENUM', () => {
    it('should have MALE value', () => {
      expect(SEX_ENUM.MALE).toBe('M');
    });

    it('should have FEMALE value', () => {
      expect(SEX_ENUM.FEMALE).toBe('F');
    });
  });

  describe('getSexTypeFromValue', () => {
    it('should return MALE when given "M"', () => {
      const result = getSexTypeFromValue('M');
      expect(result).toBe(SEX_ENUM.MALE);
    });

    it('should return FEMALE when given "F"', () => {
      const result = getSexTypeFromValue('F');
      expect(result).toBe(SEX_ENUM.FEMALE);
    });

    it('should throw ErrorCannotParseSchema for invalid value', () => {
      expect(() => getSexTypeFromValue('INVALID')).toThrow(
        ErrorCannotParseSchema
      );
    });
  });
});
