import { describe, expect, it } from '@jest/globals';

import {
  getStatusFromValue,
  STATUS_ENUM,
  statusSchema,
} from '@/domain/core/enum/status.enum';
import { ErrorCannotParseSchema } from '@/domain/core/error/cannot-parse-schema.error';

describe('[Enum] - Status', () => {
  describe('STATUS_ENUM enum', () => {
    it('should have correct ACTIVE value', () => {
      expect(STATUS_ENUM.ACTIVE).toBe(1);
    });

    it('should have correct INACTIVE value', () => {
      expect(STATUS_ENUM.INACTIVE).toBe(0);
    });

    it('should contain all expected values', () => {
      const expectedValues = [0, 1];
      const actualValues = Object.values(STATUS_ENUM).filter(
        (value) => typeof value === 'number'
      );
      expect(actualValues.sort()).toEqual(expectedValues.sort());
    });
  });

  describe('statusSchema', () => {
    it('should parse valid STATUS_ENUM values', () => {
      expect(statusSchema.parse(1)).toBe(1);
      expect(statusSchema.parse(0)).toBe(0);
    });

    it('should throw error for invalid values', () => {
      expect(() => statusSchema.parse(2)).toThrow();
      expect(() => statusSchema.parse(-1)).toThrow();
      expect(() => statusSchema.parse('1')).toThrow();
    });
  });

  describe('getStatusFromValue', () => {
    it('should return correct STATUS_ENUM for valid values', () => {
      expect(getStatusFromValue(1)).toBe(STATUS_ENUM.ACTIVE);
      expect(getStatusFromValue(0)).toBe(STATUS_ENUM.INACTIVE);
    });

    it('should throw ErrorCannotParseSchema for invalid values', () => {
      expect(() => getStatusFromValue(2)).toThrow(ErrorCannotParseSchema);
      expect(() => getStatusFromValue(-1)).toThrow(ErrorCannotParseSchema);
      expect(() => getStatusFromValue(999)).toThrow(ErrorCannotParseSchema);
    });
  });
});
