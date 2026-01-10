import { describe, expect, it } from '@jest/globals';

import { ERROR_CODE_ENUM } from '@/domain/core/enum/error-code.enum';

describe('[Enum] - ErrorCode', () => {
  describe('ERROR_CODE_ENUM enum', () => {
    it('should have correct DEFAULT_ERROR value', () => {
      expect(ERROR_CODE_ENUM.DEFAULT_ERROR).toBe('core-001');
    });

    it('should have correct ENTITY_NOT_FOUND value', () => {
      expect(ERROR_CODE_ENUM.ENTITY_NOT_FOUND).toBe('core-002');
    });

    it('should contain all expected values', () => {
      const expectedValues = ['core-001', 'core-002'];
      const actualValues = Object.values(ERROR_CODE_ENUM);
      expect(actualValues).toEqual(expectedValues);
    });
  });
});
