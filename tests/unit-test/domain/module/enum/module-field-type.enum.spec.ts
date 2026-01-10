/// <reference types="jest" />

import { describe, expect, it } from '@jest/globals';

import { ErrorCannotParseSchema } from '@/domain/core/error/cannot-parse-schema.error';
import {
  getModuleFieldTypeFromValue,
  MODULE_FIELD_TYPE_ENUM,
} from '@/domain/module/enum/module-field-type.enum';

describe('[Enum] - ModuleFieldType', () => {
  describe('MODULE_FIELD_TYPE_ENUM', () => {
    it('should have TEXT value', () => {
      expect(MODULE_FIELD_TYPE_ENUM.TEXT).toBe('TEXT');
    });

    it('should have SELECT value', () => {
      expect(MODULE_FIELD_TYPE_ENUM.SELECT).toBe('SELECT');
    });
  });

  describe('getModuleFieldTypeFromValue', () => {
    it('should return TEXT when given "TEXT"', () => {
      const result = getModuleFieldTypeFromValue('TEXT');
      expect(result).toBe(MODULE_FIELD_TYPE_ENUM.TEXT);
    });

    it('should return SELECT when given "SELECT"', () => {
      const result = getModuleFieldTypeFromValue('SELECT');
      expect(result).toBe(MODULE_FIELD_TYPE_ENUM.SELECT);
    });

    it('should throw ErrorCannotParseSchema for invalid value', () => {
      expect(() => getModuleFieldTypeFromValue('INVALID')).toThrow(
        ErrorCannotParseSchema
      );
    });
  });
});
