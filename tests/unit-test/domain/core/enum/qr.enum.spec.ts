import { describe, expect, it } from '@jest/globals';

import {
  QR_BUNDLER_VERSION,
  QRBundlerVersionSchema,
} from '@/domain/core/enum/qr.enum';

describe('[Enum] - QR', () => {
  describe('QR_BUNDLER_VERSION enum', () => {
    it('should have correct V1 value', () => {
      expect(QR_BUNDLER_VERSION.V1).toBe('1');
    });

    it('should contain all expected values', () => {
      const expectedValues = ['1'];
      const actualValues = Object.values(QR_BUNDLER_VERSION);
      expect(actualValues).toEqual(expectedValues);
    });
  });

  describe('QRBundlerVersionSchema', () => {
    it('should parse valid QR_BUNDLER_VERSION values', () => {
      expect(QRBundlerVersionSchema.parse('1')).toBe('1');
    });

    it('should throw error for invalid values', () => {
      expect(() => QRBundlerVersionSchema.parse('2')).toThrow();
      expect(() => QRBundlerVersionSchema.parse('')).toThrow();
      expect(() => QRBundlerVersionSchema.parse('v1')).toThrow();
    });
  });
});
