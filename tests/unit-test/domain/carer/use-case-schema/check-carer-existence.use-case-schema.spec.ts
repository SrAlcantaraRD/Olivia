/// <reference types="jest" />

import { describe, expect, it } from '@jest/globals';

import {
  RequestCheckCarerExistenceSchema,
  ResponseCheckCarerExistenceSchema,
  type TCheckCarerExistenceRequest,
  type TCheckCarerExistenceResponse,
} from '@/domain/carer/use-case-schema/check-carer-existence.use-case-schema';

describe('[UseCaseSchema] - CheckCarerExistence', () => {
  describe('RequestCheckCarerExistenceSchema', () => {
    it('should parse undefined/void request', () => {
      const result = RequestCheckCarerExistenceSchema.parse(undefined);
      expect(result).toBeUndefined();
    });

    it('should have correct inferred type', () => {
      const request: TCheckCarerExistenceRequest = undefined;
      expect(request).toBeUndefined();
    });
  });

  describe('ResponseCheckCarerExistenceSchema', () => {
    it('should parse valid response', () => {
      const response = { exists: true };
      const result = ResponseCheckCarerExistenceSchema.parse(response);
      expect(result.exists).toBe(true);
    });

    it('should have correct inferred type', () => {
      const response: TCheckCarerExistenceResponse = { exists: false };
      expect(response.exists).toBe(false);
    });
  });
});
