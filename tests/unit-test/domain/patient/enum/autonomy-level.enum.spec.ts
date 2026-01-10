/// <reference types="jest" />

import { describe, expect, it } from '@jest/globals';

import { ErrorCannotParseSchema } from '@/domain/core/error/cannot-parse-schema.error';
import {
  AUTONOMY_LEVEL_ENUM,
  getAutonomyLevelFromValue,
} from '@/domain/patient/enum/autonomy-level.enum';

describe('[Enum] - AutonomyLevel', () => {
  describe('AUTONOMY_LEVEL_ENUM', () => {
    it('should have NONE value', () => {
      expect(AUTONOMY_LEVEL_ENUM.NONE).toBe('NONE');
    });

    it('should have VERY_LOW value', () => {
      expect(AUTONOMY_LEVEL_ENUM.VERY_LOW).toBe('VERY_LOW');
    });

    it('should have LOW value', () => {
      expect(AUTONOMY_LEVEL_ENUM.LOW).toBe('LOW');
    });

    it('should have MEDIUM value', () => {
      expect(AUTONOMY_LEVEL_ENUM.MEDIUM).toBe('MEDIUM');
    });

    it('should have HIGH value', () => {
      expect(AUTONOMY_LEVEL_ENUM.HIGH).toBe('HIGH');
    });

    it('should have FULL value', () => {
      expect(AUTONOMY_LEVEL_ENUM.FULL).toBe('FULL');
    });
  });

  describe('getAutonomyLevelFromValue', () => {
    it('should return MEDIUM when given "MEDIUM"', () => {
      const result = getAutonomyLevelFromValue('MEDIUM');
      expect(result).toBe(AUTONOMY_LEVEL_ENUM.MEDIUM);
    });

    it('should return LOW when given "LOW"', () => {
      const result = getAutonomyLevelFromValue('LOW');
      expect(result).toBe(AUTONOMY_LEVEL_ENUM.LOW);
    });

    it('should return HIGH when given "HIGH"', () => {
      const result = getAutonomyLevelFromValue('HIGH');
      expect(result).toBe(AUTONOMY_LEVEL_ENUM.HIGH);
    });

    it('should throw ErrorCannotParseSchema for invalid value', () => {
      expect(() => getAutonomyLevelFromValue('INVALID')).toThrow(
        ErrorCannotParseSchema
      );
    });
  });
});
