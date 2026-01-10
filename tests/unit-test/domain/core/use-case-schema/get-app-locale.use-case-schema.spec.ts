import { describe, expect, it } from '@jest/globals';

import { ELocaleCode } from '@/domain/core/enum/settings.enum';
import {
  RequestGetAppLocaleSchema,
  ResponseGetAppLocaleSchema,
  type TRequestGetAppLocale,
  type TResponseGetAppLocale,
} from '@/domain/core/use-case-schema/get-app-locale.use-case-schema';

describe('[UseCaseSchema] - GetAppLocale', () => {
  describe('RequestGetAppLocaleSchema', () => {
    it('should parse void input (no parameters)', () => {
      expect(RequestGetAppLocaleSchema.parse(undefined)).toBeUndefined();
    });

    it('should have correct inferred type', () => {
      const request: TRequestGetAppLocale = undefined;
      expect(request).toBeUndefined();
    });
  });

  describe('ResponseGetAppLocaleSchema', () => {
    it('should parse valid ELocaleCode values', () => {
      expect(ResponseGetAppLocaleSchema.parse(ELocaleCode.es_ES)).toBe(
        ELocaleCode.es_ES
      );
      expect(ResponseGetAppLocaleSchema.parse(ELocaleCode.en_EN)).toBe(
        ELocaleCode.en_EN
      );
      expect(ResponseGetAppLocaleSchema.parse(ELocaleCode.ca_CA)).toBe(
        ELocaleCode.ca_CA
      );
    });

    it('should throw error for invalid locale values', () => {
      expect(() => ResponseGetAppLocaleSchema.parse('invalid')).toThrow();
      expect(() => ResponseGetAppLocaleSchema.parse('en-US')).toThrow();
      expect(() => ResponseGetAppLocaleSchema.parse(123)).toThrow();
      expect(() => ResponseGetAppLocaleSchema.parse(null)).toThrow();
    });

    it('should have correct inferred type', () => {
      const response: TResponseGetAppLocale = ELocaleCode.ca_CA;
      expect(response).toBe(ELocaleCode.ca_CA);
    });
  });
});
