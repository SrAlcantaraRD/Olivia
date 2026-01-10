/// <reference types="jest" />

import { describe, expect, it } from '@jest/globals';

import { ErrorCannotParseSchema } from '@/domain/core/error/cannot-parse-schema.error';
import {
  getModuleFieldKeyFromValue,
  MODULE_FIELD_KEY_ENUM,
} from '@/domain/module/enum/module-field-key.enum';

describe('[Enum] - ModuleFieldKey', () => {
  describe('MODULE_FIELD_KEY_ENUM', () => {
    it('should have VOLUMEN_LEVEL value', () => {
      expect(MODULE_FIELD_KEY_ENUM.VOLUMEN_LEVEL).toBe('volumen-level');
    });

    it('should have COLOR value', () => {
      expect(MODULE_FIELD_KEY_ENUM.COLOR).toBe('color');
    });

    it('should have TURBIDITY value', () => {
      expect(MODULE_FIELD_KEY_ENUM.TURBIDITY).toBe('turbidity');
    });

    it('should have DISCOMFORT_LEVEL value', () => {
      expect(MODULE_FIELD_KEY_ENUM.DISCOMFORT_LEVEL).toBe('discomfort-level');
    });
  });

  describe('getModuleFieldKeyFromValue', () => {
    it('should return VOLUMEN_LEVEL when given "volumen-level"', () => {
      const result = getModuleFieldKeyFromValue('volumen-level');
      expect(result).toBe(MODULE_FIELD_KEY_ENUM.VOLUMEN_LEVEL);
    });

    it('should return COLOR when given "color"', () => {
      const result = getModuleFieldKeyFromValue('color');
      expect(result).toBe(MODULE_FIELD_KEY_ENUM.COLOR);
    });

    it('should throw ErrorCannotParseSchema for invalid value', () => {
      expect(() => getModuleFieldKeyFromValue('INVALID')).toThrow(
        ErrorCannotParseSchema
      );
    });
  });
});
