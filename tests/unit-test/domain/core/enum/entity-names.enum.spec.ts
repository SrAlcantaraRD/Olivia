import { describe, expect, it } from '@jest/globals';

import { ENTITY_NAME } from '@/domain/core/enum/entity-names.enum';

describe('[Enum] - EntityNames', () => {
  describe('ENTITY_NAME enum', () => {
    it('should have correct CARER value', () => {
      expect(ENTITY_NAME.CARER).toBe('carer');
    });

    it('should have correct PATIENT value', () => {
      expect(ENTITY_NAME.PATIENT).toBe('patient');
    });

    it('should have correct MODULE value', () => {
      expect(ENTITY_NAME.MODULE).toBe('module');
    });

    it('should have correct MODULE_FIELD value', () => {
      expect(ENTITY_NAME.MODULE_FIELD).toBe('module-field');
    });

    it('should have correct RECORD value', () => {
      expect(ENTITY_NAME.RECORD).toBe('record');
    });

    it('should contain all expected values', () => {
      const expectedValues = [
        'carer',
        'patient',
        'module',
        'module-field',
        'record',
      ];
      const actualValues = Object.values(ENTITY_NAME);
      expect(actualValues).toEqual(expectedValues);
    });
  });
});
