/// <reference types="jest" />

import { describe, expect, it } from '@jest/globals';

import { CARER_TYPE_ENUM } from '@/domain/carer/enum/carer-type.enums';
import {
  RequestCreateCarerSchema,
  type TRequestCreateCarer,
  type TResponseCreateCarer,
} from '@/domain/carer/use-case-schema/create-carer.use-case-schema';
import { mockCarerEntity } from '@/tests/mocks/carer.entity.mock';

describe('[UseCaseSchema] - CreateCarer', () => {
  describe('RequestCreateCarerSchema', () => {
    it('should parse valid request', () => {
      const request = {
        name: 'John Doe',
        isPrimary: true,
        pinHash: 'hashed-pin',
        type: CARER_TYPE_ENUM.ADMIN,
      };
      const result = RequestCreateCarerSchema.parse(request);
      expect(result.name).toBe('John Doe');
      expect(result.isPrimary).toBe(true);
      expect(result.type).toBe(CARER_TYPE_ENUM.ADMIN);
    });

    it('should throw error for missing required fields', () => {
      expect(() =>
        RequestCreateCarerSchema.parse({
          name: 'John Doe',
        })
      ).toThrow();
    });

    it('should throw error for invalid type', () => {
      expect(() =>
        RequestCreateCarerSchema.parse({
          name: 'John Doe',
          isPrimary: true,
          pinHash: 'hash',
          type: 'INVALID',
        })
      ).toThrow();
    });

    it('should have correct inferred type', () => {
      const request: TRequestCreateCarer = {
        name: 'Test',
        isPrimary: true,
        pinHash: 'hash',
        type: CARER_TYPE_ENUM.ADMIN,
      };
      expect(request.name).toBe('Test');
    });
  });

  describe('TResponseCreateCarer', () => {
    it('should be a TCarer type', () => {
      const response: TResponseCreateCarer = mockCarerEntity();
      expect(response.id).toBeDefined();
      expect(response.name).toBeDefined();
    });
  });
});
