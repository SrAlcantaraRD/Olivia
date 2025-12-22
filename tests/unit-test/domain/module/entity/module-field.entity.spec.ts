/// <reference types="jest" />

import { describe, expect, it } from '@jest/globals';

import { ModuleFieldSchema } from '@/domain/module/entity/module-field.entity';
import { MODULE_FIELD_TYPE_ENUM } from '@/domain/module/enum/module-field-type.enum';
import { mockModuleFieldEntity } from '@/tests/mocks/module-field.entity.mock';

describe('[Entity] - ModuleField', () => {
  const prepareSuiteCase = () => {
    // Arrange
    const unit = ModuleFieldSchema;
    return { unit };
  };

  beforeEach(() => jest.clearAllMocks());

  describe('Happy Path', () => {
    it('accepts TEXT fields with any values string', () => {
      const { unit } = prepareSuiteCase();

      const entity = mockModuleFieldEntity({
        type: MODULE_FIELD_TYPE_ENUM.TEXT,
        values: 'not-json-at-all',
      });

      const result = unit.safeParse(entity);

      expect(result.success).toBe(true);
    });

    it('accepts SELECT fields with JSON array string values', () => {
      const { unit } = prepareSuiteCase();

      const entity = mockModuleFieldEntity({
        type: MODULE_FIELD_TYPE_ENUM.SELECT,
        values: JSON.stringify(['low', 'normal', 'high']),
      });

      const result = unit.safeParse(entity);

      expect(result.success).toBe(true);
    });
  });

  describe('Unhappy Path', () => {
    it('rejects SELECT fields with non-JSON values', () => {
      const { unit } = prepareSuiteCase();

      const entity = mockModuleFieldEntity({
        type: MODULE_FIELD_TYPE_ENUM.SELECT,
        values: 'low,normal,high',
      });

      const result = unit.safeParse(entity);

      expect(result.success).toBe(false);
    });

    it('rejects SELECT fields with empty JSON array', () => {
      const { unit } = prepareSuiteCase();

      const entity = mockModuleFieldEntity({
        type: MODULE_FIELD_TYPE_ENUM.SELECT,
        values: '[]',
      });

      const result = unit.safeParse(entity);

      expect(result.success).toBe(false);
    });

    it('rejects SELECT fields with JSON but non-string items', () => {
      const { unit } = prepareSuiteCase();

      const entity = mockModuleFieldEntity({
        type: MODULE_FIELD_TYPE_ENUM.SELECT,
        values: '[1,2,3]',
      });

      const result = unit.safeParse(entity);

      expect(result.success).toBe(false);
    });
  });
});
