/// <reference types="jest" />

import { describe, expect, it } from '@jest/globals';

import {
  RequestGetModuleFieldListSchema,
  ResponseGetModuleFieldListSchema,
} from '@/domain/module/use-case-schema/get-module-field-list.use-case-schema';
import { mockModuleFieldEntity } from '@/tests/mocks/module-field.entity.mock';

describe('[UseCaseSchema] - GetModuleFieldList', () => {
  describe('RequestGetModuleFieldListSchema', () => {
    it('should parse valid request', () => {
      const request = {
        moduleID: 1,
      };
      const result = RequestGetModuleFieldListSchema.parse(request);
      expect(result.moduleID).toBe(1);
    });

    it('should apply default moduleID when missing', () => {
      const result = RequestGetModuleFieldListSchema.parse({});
      expect(result.moduleID).toBe(1); // default value
    });

    it('should throw error for invalid moduleID type', () => {
      expect(() =>
        RequestGetModuleFieldListSchema.parse({
          moduleID: 'invalid',
        })
      ).toThrow();
    });
  });

  describe('ResponseGetModuleFieldListSchema', () => {
    it('should parse valid response', () => {
      const mockFields = [mockModuleFieldEntity(), mockModuleFieldEntity()];
      const response = {
        items: mockFields,
      };
      const result = ResponseGetModuleFieldListSchema.parse(response);
      expect(result.items).toEqual(mockFields);
    });

    it('should parse empty items array', () => {
      const response = {
        items: [],
      };
      const result = ResponseGetModuleFieldListSchema.parse(response);
      expect(result.items).toEqual([]);
    });

    it('should throw error for missing items', () => {
      expect(() => ResponseGetModuleFieldListSchema.parse({})).toThrow();
    });

    it('should throw error for invalid items type', () => {
      expect(() =>
        ResponseGetModuleFieldListSchema.parse({
          items: 'invalid',
        })
      ).toThrow();
    });
  });
});
