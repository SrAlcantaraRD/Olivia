/// <reference types="jest" />

import { describe, expect, it } from '@jest/globals';

import {
  RequestDeleteCarerSchema,
  type TRequestDeleteCarer,
  type TResponseDeleteCarer,
} from '@/domain/carer/use-case-schema/delete-carer.use-case-schema';

describe('[UseCaseSchema] - DeleteCarer', () => {
  describe('RequestDeleteCarerSchema', () => {
    it('should parse valid carerID', () => {
      const request = { carerID: 123 };
      const result = RequestDeleteCarerSchema.parse(request);
      expect(result.carerID).toBe(123);
    });

    it('should throw error for invalid carerID values', () => {
      expect(() => RequestDeleteCarerSchema.parse({ carerID: 0 })).toThrow();
      expect(() => RequestDeleteCarerSchema.parse({ carerID: -1 })).toThrow();
      expect(() =>
        RequestDeleteCarerSchema.parse({ carerID: '123' })
      ).toThrow();
    });

    it('should use default carerID when not provided', () => {
      const result = RequestDeleteCarerSchema.parse({});
      expect(result.carerID).toBe(1);
    });

    it('should have correct inferred type', () => {
      const request: TRequestDeleteCarer = { carerID: 456 };
      expect(request.carerID).toBe(456);
    });
  });

  describe('TResponseDeleteCarer', () => {
    it('should be defined', () => {
      const response: TResponseDeleteCarer = undefined;
      expect(response).toBeUndefined();
    });
  });
});
