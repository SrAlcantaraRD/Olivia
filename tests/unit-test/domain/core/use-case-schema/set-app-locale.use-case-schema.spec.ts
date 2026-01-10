import { describe, expect, it } from '@jest/globals';

import {
  RequestSetAppLocaleSchema,
  ResponseSetAppLocaleSchema,
  type TRequestSetAppLocale,
  type TResponseSetAppLocale,
} from '@/domain/core/use-case-schema/set-app-locale.use-case-schema';

describe('[UseCaseSchema] - SetAppLocale', () => {
  describe('RequestSetAppLocaleSchema', () => {
    it('should parse valid locale values', () => {
      expect(RequestSetAppLocaleSchema.parse({ locale: 'en-EN' })).toEqual({
        locale: 'en-EN',
      });
      expect(RequestSetAppLocaleSchema.parse({ locale: 'es-ES' })).toEqual({
        locale: 'es-ES',
      });
      expect(RequestSetAppLocaleSchema.parse({ locale: 'ca-CA' })).toEqual({
        locale: 'ca-CA',
      });
    });

    it('should throw error for invalid locale values', () => {
      expect(() =>
        RequestSetAppLocaleSchema.parse({ locale: 'invalid' })
      ).toThrow();
      expect(() =>
        RequestSetAppLocaleSchema.parse({ locale: 'en-US' })
      ).toThrow();
      expect(() => RequestSetAppLocaleSchema.parse({})).toThrow();
      expect(() => RequestSetAppLocaleSchema.parse({ locale: 123 })).toThrow();
    });

    it('should have correct inferred type', () => {
      const request: TRequestSetAppLocale = { locale: 'es-ES' };
      expect(request.locale).toBe('es-ES');
    });
  });

  describe('ResponseSetAppLocaleSchema', () => {
    it('should parse void input (no response data)', () => {
      expect(ResponseSetAppLocaleSchema.parse(undefined)).toBeUndefined();
    });

    it('should have correct inferred type', () => {
      const response: TResponseSetAppLocale = undefined;
      expect(response).toBeUndefined();
    });
  });
});
