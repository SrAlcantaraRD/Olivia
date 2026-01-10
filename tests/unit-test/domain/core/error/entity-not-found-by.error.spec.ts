import { describe, expect, it } from '@jest/globals';

import { ERROR_CODE_ENUM } from '@/domain/core/enum/error-code.enum';
import { ErrorEntityNotFoundBy } from '@/domain/core/error/entity-not-found-by.error';

describe('[Error] - EntityNotFoundBy', () => {
  describe('ErrorEntityNotFoundBy class', () => {
    it('should create error with correct properties for string field', () => {
      const entity = 'User';
      const field = 'email';
      const value = 'test@example.com';

      const error = new ErrorEntityNotFoundBy(entity, field, value);

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(ErrorEntityNotFoundBy);
      expect(error.name).toBe(ERROR_CODE_ENUM.ENTITY_NOT_FOUND);
      expect(error.code).toBe(entity);
      expect(error.message).toBe(
        `Could not find entity "${entity}" by "${field}" equal to "${value}".`
      );
    });

    it('should create error with correct properties for numeric field', () => {
      const entity = 'Patient';
      const field = 'id';
      const value = 123;

      const error = new ErrorEntityNotFoundBy(entity, field, value);

      expect(error.name).toBe(ERROR_CODE_ENUM.ENTITY_NOT_FOUND);
      expect(error.code).toBe(entity);
      expect(error.message).toBe(
        `Could not find entity "${entity}" by "${field}" equal to "${value}".`
      );
    });

    it('should handle different entity types and fields', () => {
      const testCases = [
        { entity: 'Carer', field: 'id', value: 456 },
        { entity: 'Module', field: 'name', value: 'health' },
        { entity: 'Record', field: 'createdAt', value: '2024-01-01' },
      ];

      testCases.forEach(({ entity, field, value }) => {
        const error = new ErrorEntityNotFoundBy(entity, field, value);
        expect(error.name).toBe(ERROR_CODE_ENUM.ENTITY_NOT_FOUND);
        expect(error.code).toBe(entity);
        expect(error.message).toContain(entity);
        expect(error.message).toContain(field);
        expect(error.message).toContain(String(value));
      });
    });

    it('should have proper inheritance from Error', () => {
      const error = new ErrorEntityNotFoundBy('Test', 'id', 1);

      expect(error instanceof Error).toBe(true);
      expect(error.stack).toBeDefined();
      expect(typeof error.toString).toBe('function');
    });
  });
});
