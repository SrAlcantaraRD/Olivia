/// <reference types="jest" />

import { describe, expect, it } from '@jest/globals';

import {
  RequestGetActiveModuleListSchema,
  ResponseGetActiveModuleListSchema,
} from '@/domain/module/use-case-schema/get-active-module-list.use-case-schema';
import { mockModuleEntity } from '@/tests/mocks/module.entity.mock';

describe('[UseCaseSchema] - GetActiveModuleList', () => {
  describe('RequestGetActiveModuleListSchema', () => {
    it('should parse void request', () => {
      const result = RequestGetActiveModuleListSchema.parse(undefined);
      expect(result).toBeUndefined();
    });
  });

  describe('ResponseGetActiveModuleListSchema', () => {
    it('should parse valid response', () => {
      const mockModules = [mockModuleEntity(), mockModuleEntity()];
      const response = {
        items: mockModules,
      };
      const result = ResponseGetActiveModuleListSchema.parse(response);
      expect(result.items).toHaveLength(2);
      expect(result.items[0]).toMatchObject({
        id: 1,
        name: 'Test Module',
        isActive: true,
        code: 'CIC',
      });
    });

    it('should parse empty items array', () => {
      const response = {
        items: [],
      };
      const result = ResponseGetActiveModuleListSchema.parse(response);
      expect(result.items).toEqual([]);
    });

    it('should throw error for missing items', () => {
      expect(() => ResponseGetActiveModuleListSchema.parse({})).toThrow();
    });

    it('should throw error for invalid items type', () => {
      expect(() =>
        ResponseGetActiveModuleListSchema.parse({
          items: 'invalid',
        })
      ).toThrow();
    });
  });
});
