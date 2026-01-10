import { describe, expect, it } from '@jest/globals';

import {
  RequestSetAppThemeSchema,
  ResponseSetAppThemeSchema,
  type TRequestSetAppTheme,
  type TResponseSetAppTheme,
} from '@/domain/core/use-case-schema/set-app-theme.use-case-schema';

describe('[UseCaseSchema] - SetAppTheme', () => {
  describe('RequestSetAppThemeSchema', () => {
    it('should parse valid theme values', () => {
      expect(RequestSetAppThemeSchema.parse({ theme: 'light' })).toEqual({
        theme: 'light',
      });
      expect(RequestSetAppThemeSchema.parse({ theme: 'dark' })).toEqual({
        theme: 'dark',
      });
    });

    it('should throw error for invalid theme values', () => {
      expect(() =>
        RequestSetAppThemeSchema.parse({ theme: 'invalid' })
      ).toThrow();
      expect(() =>
        RequestSetAppThemeSchema.parse({ theme: 'LIGHT' })
      ).toThrow();
      expect(() => RequestSetAppThemeSchema.parse({})).toThrow();
      expect(() => RequestSetAppThemeSchema.parse({ theme: 123 })).toThrow();
    });

    it('should have correct inferred type', () => {
      const request: TRequestSetAppTheme = { theme: 'dark' };
      expect(request.theme).toBe('dark');
    });
  });

  describe('ResponseSetAppThemeSchema', () => {
    it('should parse void input (no response data)', () => {
      expect(ResponseSetAppThemeSchema.parse(undefined)).toBeUndefined();
    });

    it('should have correct inferred type', () => {
      const response: TResponseSetAppTheme = undefined;
      expect(response).toBeUndefined();
    });
  });
});
