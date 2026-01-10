import { describe, expect, it } from '@jest/globals';

import { ELocaleCode, EThemeMode } from '@/domain/core/enum/settings.enum';

describe('[Enum] - Settings', () => {
  describe('EThemeMode enum', () => {
    it('should have correct LIGHT value', () => {
      expect(EThemeMode.LIGHT).toBe('light');
    });

    it('should have correct DARK value', () => {
      expect(EThemeMode.DARK).toBe('dark');
    });

    it('should contain all expected values', () => {
      const expectedValues = ['light', 'dark'];
      const actualValues = Object.values(EThemeMode);
      expect(actualValues).toEqual(expectedValues);
    });
  });

  describe('ELocaleCode enum', () => {
    it('should have correct en_EN value', () => {
      expect(ELocaleCode.en_EN).toBe('en-EN');
    });

    it('should have correct es_ES value', () => {
      expect(ELocaleCode.es_ES).toBe('es-ES');
    });

    it('should have correct ca_CA value', () => {
      expect(ELocaleCode.ca_CA).toBe('ca-CA');
    });

    it('should contain all expected values', () => {
      const expectedValues = ['en-EN', 'es-ES', 'ca-CA'];
      const actualValues = Object.values(ELocaleCode);
      expect(actualValues).toEqual(expectedValues);
    });
  });
});
