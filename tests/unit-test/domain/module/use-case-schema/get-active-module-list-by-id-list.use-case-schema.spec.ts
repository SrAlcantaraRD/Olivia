/// <reference types="jest" />

import { describe, expect, it } from '@jest/globals';

import {
  RequestModuleListByIDListSchema,
  ResponseModuleListByIDListSchema,
} from '@/domain/module/use-case-schema/get-active-module-list-by-id-list.use-case-schema';
import { mockModuleEntity } from '@/tests/mocks/module.entity.mock';

describe('[UseCaseSchema] - ModuleListByIDList', () => {
  describe('RequestModuleListByIDListSchema', () => {
    it('should parse valid request', () => {
      const request = {
        idList: [1, 2, 3],
      };
      const result = RequestModuleListByIDListSchema.parse(request);
      expect(result.idList).toEqual([1, 2, 3]);
    });

    it('should parse empty idList', () => {
      const request = {
        idList: [],
      };
      const result = RequestModuleListByIDListSchema.parse(request);
      expect(result.idList).toEqual([]);
    });

    it('should throw error for missing idList', () => {
      expect(() => RequestModuleListByIDListSchema.parse({})).toThrow();
    });

    it('should throw error for invalid idList type', () => {
      expect(() =>
        RequestModuleListByIDListSchema.parse({
          idList: 'invalid',
        })
      ).toThrow();
    });

    it('should throw error for invalid id in list', () => {
      expect(() =>
        RequestModuleListByIDListSchema.parse({
          idList: [1, 'invalid', 3],
        })
      ).toThrow();
    });
  });

  describe('ResponseModuleListByIDListSchema', () => {
    it('should parse valid response', () => {
      const mockModules = [mockModuleEntity(), mockModuleEntity()];
      const response = {
        items: mockModules,
      };
      const result = ResponseModuleListByIDListSchema.parse(response);
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
      const result = ResponseModuleListByIDListSchema.parse(response);
      expect(result.items).toEqual([]);
    });

    it('should throw error for missing items', () => {
      expect(() => ResponseModuleListByIDListSchema.parse({})).toThrow();
    });

    it('should throw error for invalid items type', () => {
      expect(() =>
        ResponseModuleListByIDListSchema.parse({
          items: 'invalid',
        })
      ).toThrow();
    });
  });
});
