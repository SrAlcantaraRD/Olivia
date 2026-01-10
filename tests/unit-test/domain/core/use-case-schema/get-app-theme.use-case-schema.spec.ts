import { describe, expect, it } from '@jest/globals';

import { EThemeMode } from '@/domain/core/enum/settings.enum';
import {
  RequestGetAppThemeSchema,
  ResponseGetAppThemeSchema,
  type TRequestGetAppTheme,
  type TResponseGetAppTheme,
} from '@/domain/core/use-case-schema/get-app-theme.use-case-schema';

describe('[UseCaseSchema] - GetAppTheme', () => {
  describe('RequestGetAppThemeSchema', () => {
    it('should parse void input (no parameters)', () => {
      expect(RequestGetAppThemeSchema.parse(undefined)).toBeUndefined();
    });

    it('should have correct inferred type', () => {
      const request: TRequestGetAppTheme = undefined;
      expect(request).toBeUndefined();
    });
  });

  describe('ResponseGetAppThemeSchema', () => {
    it('should parse valid EThemeMode values', () => {
      expect(ResponseGetAppThemeSchema.parse(EThemeMode.LIGHT)).toBe(
        EThemeMode.LIGHT
      );
      expect(ResponseGetAppThemeSchema.parse(EThemeMode.DARK)).toBe(
        EThemeMode.DARK
      );
    });

    it('should throw error for invalid theme values', () => {
      expect(() => ResponseGetAppThemeSchema.parse('invalid')).toThrow();
      expect(() => ResponseGetAppThemeSchema.parse(123)).toThrow();
      expect(() => ResponseGetAppThemeSchema.parse(null)).toThrow();
    });

    it('should have correct inferred type', () => {
      const response: TResponseGetAppTheme = EThemeMode.LIGHT;
      expect(response).toBe(EThemeMode.LIGHT);
    });
  });
});
