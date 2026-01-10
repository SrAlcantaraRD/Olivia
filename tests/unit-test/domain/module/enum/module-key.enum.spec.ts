/// <reference types="jest" />

import { describe, expect, it } from '@jest/globals';

import { ErrorCannotParseSchema } from '@/domain/core/error/cannot-parse-schema.error';
import {
  getModuleKeyFromValue,
  MODULE_KEY_ENUM,
} from '@/domain/module/enum/module-key.enum';

describe('[Enum] - ModuleKey', () => {
  describe('MODULE_KEY_ENUM', () => {
    it('should have CIC value', () => {
      expect(MODULE_KEY_ENUM.CIC).toBe('CIC');
    });

    it('should have URINE value', () => {
      expect(MODULE_KEY_ENUM.URINE).toBe('URINE');
    });

    it('should have STOOL value', () => {
      expect(MODULE_KEY_ENUM.STOOL).toBe('STOOL');
    });

    it('should have MEDICATION value', () => {
      expect(MODULE_KEY_ENUM.MEDICATION).toBe('MEDICATION');
    });

    it('should have ENEMA value', () => {
      expect(MODULE_KEY_ENUM.ENEMA).toBe('ENEMA');
    });
  });

  describe('getModuleKeyFromValue', () => {
    it('should return CIC when given "CIC"', () => {
      const result = getModuleKeyFromValue('CIC');
      expect(result).toBe(MODULE_KEY_ENUM.CIC);
    });

    it('should return URINE when given "URINE"', () => {
      const result = getModuleKeyFromValue('URINE');
      expect(result).toBe(MODULE_KEY_ENUM.URINE);
    });

    it('should throw ErrorCannotParseSchema for invalid value', () => {
      expect(() => getModuleKeyFromValue('INVALID')).toThrow(
        ErrorCannotParseSchema
      );
    });
  });
});
