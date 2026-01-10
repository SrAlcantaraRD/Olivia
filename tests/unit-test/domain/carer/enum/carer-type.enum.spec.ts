/// <reference types="jest" />

import { describe, expect, it } from '@jest/globals';

import {
  CARER_TYPE_ENUM,
  getCarerTypeFromValue,
} from '@/domain/carer/enum/carer-type.enums';
import { ErrorCannotParseSchema } from '@/domain/core/error/cannot-parse-schema.error';

describe('[Enum] - CarerType', () => {
  describe('CARER_TYPE_ENUM', () => {
    it('should have ADMIN value', () => {
      expect(CARER_TYPE_ENUM.ADMIN).toBe('ADMIN');
    });

    it('should have SECONDARY value', () => {
      expect(CARER_TYPE_ENUM.SECONDARY).toBe('SECUNDARIO');
    });

    it('should have HEALTH value', () => {
      expect(CARER_TYPE_ENUM.HEALTH).toBe('SANITARIO');
    });
  });

  describe('getCarerTypeFromValue', () => {
    it('should return ADMIN when given "ADMIN"', () => {
      const result = getCarerTypeFromValue('ADMIN');
      expect(result).toBe(CARER_TYPE_ENUM.ADMIN);
    });

    it('should return SECONDARY when given "SECUNDARIO"', () => {
      const result = getCarerTypeFromValue('SECUNDARIO');
      expect(result).toBe(CARER_TYPE_ENUM.SECONDARY);
    });

    it('should return HEALTH when given "SANITARIO"', () => {
      const result = getCarerTypeFromValue('SANITARIO');
      expect(result).toBe(CARER_TYPE_ENUM.HEALTH);
    });

    it('should throw ErrorCannotParseSchema for invalid value', () => {
      expect(() => getCarerTypeFromValue('INVALID')).toThrow(
        ErrorCannotParseSchema
      );
    });

    it('should throw ErrorCannotParseSchema for empty string', () => {
      expect(() => getCarerTypeFromValue('')).toThrow(ErrorCannotParseSchema);
    });
  });
});
